
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send } from "lucide-react";

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; content: string }>>([
    { type: 'ai', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input.trim() }]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I can help you with that. Please provide more details.",
        "Let me analyze the data and get back to you with insights.",
        "Based on your business metrics, I recommend focusing on these areas.",
        "I found some relevant information in your reports that might help.",
        "Would you like me to generate a summary of your recent performance?"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages(prev => [...prev, { type: 'ai', content: randomResponse }]);
    }, 1000);
    
    // Clear input
    setInput('');
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col w-80 sm:w-96 h-96 rounded-lg border shadow-lg bg-card">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-business-600 text-white">
                <MessageSquare className="h-3 w-3" />
              </div>
              <h3 className="font-medium">AI Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-business-100 text-business-900"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestion chips */}
          <div className="px-4 py-2 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => {
                setInput("Show me recent sales data");
              }}
            >
              Sales data
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => {
                setInput("Help with financial reports");
              }}
            >
              Financial reports
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => {
                setInput("Create new marketing campaign");
              }}
            >
              Marketing campaign
            </Button>
          </div>

          {/* Input */}
          <div className="border-t p-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
