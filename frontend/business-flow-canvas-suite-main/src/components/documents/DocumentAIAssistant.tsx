import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send, FileText, Bot } from "lucide-react";
import { supabaseAIDocumentService } from "@/services/SupabaseAIDocumentService";
import { FileMetadata } from "@/services/supabaseStorageService";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface DocumentAIAssistantProps {
  selectedDocument?: FileMetadata | null;
}

const DocumentAIAssistant = ({ selectedDocument }: DocumentAIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Document AI Assistant. I can help you understand and extract information from your documents. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Add loading message
    const loadingMessageId = generateId();
    setMessages(prev => [...prev, {
      id: loadingMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    }]);

    setIsProcessing(true);

    try {
      // If a document is selected, include it in the context
      let prompt = input;
      if (selectedDocument) {
        // Check if document has been processed
        const isProcessed = await supabaseAIDocumentService.isDocumentProcessed(selectedDocument.id);

        if (isProcessed) {
          // Get document metadata
          const metadata = await supabaseAIDocumentService.getDocumentMetadata(selectedDocument.id);

          if (metadata && metadata.summary) {
            // Use the document summary as context
            prompt = `Context: This question is about the document "${selectedDocument.name}". Here's a summary of the document: ${metadata.summary}\n\nQuestion: ${input}`;
          }
        } else {
          // Document hasn't been processed yet
          prompt = `The document "${selectedDocument.name}" hasn't been processed yet. I'll answer based on general knowledge. ${input}`;
        }
      }

      // Call Azure OpenAI directly for now (in a real implementation, we would use our Python service)
      // This is a placeholder for the actual implementation
      // Simulate a delay for the response
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a response based on the document if selected
      let response = '';
      if (selectedDocument) {
        if (input.toLowerCase().includes('summary') || input.toLowerCase().includes('summarize')) {
          const metadata = await supabaseAIDocumentService.getDocumentMetadata(selectedDocument.id);
          response = metadata?.summary || "I don't have a summary for this document yet. Please process the document first.";
        } else if (input.toLowerCase().includes('topic') || input.toLowerCase().includes('about')) {
          const metadata = await supabaseAIDocumentService.getDocumentMetadata(selectedDocument.id);
          if (metadata?.topics) {
            const topics = Object.keys(metadata.topics).join(', ');
            response = `This document is about: ${topics}`;
          } else {
            response = "I don't have topic information for this document yet. Please process the document first.";
          }
        } else if (input.toLowerCase().includes('entity') || input.toLowerCase().includes('people') || input.toLowerCase().includes('organization')) {
          const metadata = await supabaseAIDocumentService.getDocumentMetadata(selectedDocument.id);
          if (metadata?.entities) {
            const people = metadata.entities.people?.join(', ') || 'None';
            const orgs = metadata.entities.organizations?.join(', ') || 'None';
            response = `People mentioned: ${people}\nOrganizations mentioned: ${orgs}`;
          } else {
            response = "I don't have entity information for this document yet. Please process the document first.";
          }
        } else if (input.toLowerCase().includes('sentiment')) {
          const metadata = await supabaseAIDocumentService.getDocumentMetadata(selectedDocument.id);
          if (metadata?.sentiment) {
            response = `The overall sentiment of this document is ${metadata.sentiment.overall} with a score of ${metadata.sentiment.score.toFixed(2)}.`;
          } else {
            response = "I don't have sentiment information for this document yet. Please process the document first.";
          }
        } else {
          response = `I'm analyzing your question about "${selectedDocument.name}". To get the most accurate information, please make sure the document has been processed with AI analysis first.`;
        }
      } else {
        response = "Please select a document first so I can provide specific information about it. You can select a document from the list on the left.";
      }

      // Update the loading message with the response
      setMessages(prev => prev.map(msg =>
        msg.id === loadingMessageId
          ? { ...msg, content: response, isLoading: false }
          : msg
      ));
    } catch (error) {
      console.error('Error processing message:', error);

      // Update the loading message with an error
      setMessages(prev => prev.map(msg =>
        msg.id === loadingMessageId
          ? { ...msg, content: 'Sorry, I encountered an error while processing your request. Please try again.', isLoading: false }
          : msg
      ));

      toast({
        title: 'Error',
        description: 'Failed to process your request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Document AI Assistant
        </CardTitle>
        <CardDescription>
          {selectedDocument
            ? `Ask questions about "${selectedDocument.name}"`
            : "Select a document to ask specific questions about it"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className={message.role === 'user' ? 'bg-primary' : 'bg-muted'}>
                <AvatarFallback>
                  {message.role === 'user' ? 'U' : 'AI'}
                </AvatarFallback>
                {message.role === 'assistant' && (
                  <AvatarImage src="/ai-assistant.png" />
                )}
              </Avatar>
              <div className={`rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}>
                {message.isLoading ? (
                  <div className="flex items-center justify-center h-6">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
                <div className={`text-xs mt-1 ${
                  message.role === 'user'
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <form
          className="flex w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            placeholder="Ask about your document..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isProcessing || !input.trim()}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default DocumentAIAssistant;
