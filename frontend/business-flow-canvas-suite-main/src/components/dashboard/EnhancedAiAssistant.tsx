
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  X, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  BarChart2,
  FileText,
  Users,
  ShoppingCart,
  Database,
  Search
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  module?: string;
  timestamp: Date;
}

interface Suggestion {
  text: string;
  module?: string;
}

interface DataInsight {
  id: string;
  title: string;
  description: string;
  module: string;
  icon: React.ReactNode;
}

const EnhancedAiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "welcome", 
      type: 'ai', 
      content: "Hello! I'm your BusinessOS AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const insights: DataInsight[] = [
    {
      id: "1",
      title: "Sales Forecast",
      description: "Based on current trends, your Q3 sales are projected to increase by 12% compared to Q2.",
      module: "Sales",
      icon: <ShoppingCart size={16} />
    },
    {
      id: "2",
      title: "Expense Anomaly",
      description: "Unusual increase in travel expenses detected this month - 27% higher than average.",
      module: "Finance",
      icon: <Database size={16} />
    },
    {
      id: "3",
      title: "Team Performance",
      description: "Support team response time improved by 15% this week, exceeding target metrics.",
      module: "HR",
      icon: <Users size={16} />
    },
    {
      id: "4",
      title: "Document Analysis",
      description: "5 contracts are expiring within the next 30 days - review recommended.",
      module: "Documents",
      icon: <FileText size={16} />
    },
    {
      id: "5",
      title: "Market Trend",
      description: "Recent market analysis shows growing demand in your sector, consider expanding product line.",
      module: "Business Intelligence",
      icon: <BarChart2 size={16} />
    }
  ];

  const suggestions: Suggestion[] = [
    { text: "Show me recent sales data", module: "Sales" },
    { text: "Analyze customer feedback", module: "Customer Service" },
    { text: "Generate quarterly report", module: "Finance" },
    { text: "Check inventory status", module: "Inventory" },
    { text: "Summarize marketing campaign performance", module: "Marketing" },
    { text: "Show team productivity metrics", module: "HR" },
    { text: "Recommend process improvements", module: "Business Intelligence" }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input.trim(),
      module: activeModule || undefined,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      let response: string;
      
      if (input.toLowerCase().includes('sales') || activeModule === 'Sales') {
        response = "Based on your sales data from the last quarter, I can see a 12% increase in overall revenue. The strongest performing product category was 'Enterprise Solutions' with a 24% growth rate.";
      } else if (input.toLowerCase().includes('report') || input.toLowerCase().includes('generate')) {
        response = "I've generated a comprehensive report based on your requirements. You can download it from the Reports section or I can email it to your team members.";
      } else if (input.toLowerCase().includes('inventory') || activeModule === 'Inventory') {
        response = "Current inventory levels are at 78% capacity. There are 3 products (SKU-1242, SKU-3567, SKU-8901) that are below the reorder threshold and should be restocked soon.";
      } else if (input.toLowerCase().includes('marketing') || activeModule === 'Marketing') {
        response = "Your recent email marketing campaign achieved a 24% open rate and 3.7% click-through rate, which is 5% higher than industry average. I recommend optimizing the landing page to improve conversion rates further.";
      } else if (input.toLowerCase().includes('customer') || activeModule === 'Customer Service') {
        response = "Customer satisfaction is currently at 87%, which is a 3% improvement from last month. The main areas for improvement are response time and first-contact resolution rate.";
      } else {
        response = "I've analyzed your request and have the following insights: Your team's productivity has increased by 15% this quarter. Would you like me to provide a more detailed breakdown by department or project?";
      }
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: response,
        module: activeModule || undefined,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleModuleSelect = (module: string) => {
    setActiveModule(module === activeModule ? null : module);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const getModuleColor = (module: string | undefined) => {
    if (!module) return '';
    
    const moduleColors: Record<string, string> = {
      'Sales': 'bg-blue-100 text-blue-800',
      'Finance': 'bg-green-100 text-green-800',
      'HR': 'bg-purple-100 text-purple-800',
      'Marketing': 'bg-amber-100 text-amber-800',
      'Customer Service': 'bg-rose-100 text-rose-800',
      'Projects': 'bg-indigo-100 text-indigo-800',
      'Documents': 'bg-orange-100 text-orange-800',
      'Inventory': 'bg-emerald-100 text-emerald-800',
      'Business Intelligence': 'bg-cyan-100 text-cyan-800'
    };
    
    return moduleColors[module] || 'bg-gray-100 text-gray-800';
  };

  const modules = [
    { id: "sales", name: "Sales", icon: <ShoppingCart size={16} /> },
    { id: "finance", name: "Finance", icon: <Database size={16} /> },
    { id: "hr", name: "HR", icon: <Users size={16} /> },
    { id: "marketing", name: "Marketing", icon: <BarChart2 size={16} /> },
    { id: "documents", name: "Documents", icon: <FileText size={16} /> }
  ];

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
        <div 
          className={`fixed bottom-4 right-4 z-50 flex flex-col rounded-lg border shadow-lg bg-card ${
            isExpanded ? 'w-[600px] h-[500px]' : 'w-80 sm:w-96 h-96'
          } transition-all duration-300`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-business-600 text-white">
                <MessageSquare className="h-3 w-3" />
              </div>
              <h3 className="font-medium">BusinessOS AI Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main chat area */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
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
                        {message.module && (
                          <div className={`text-xs px-2 py-0.5 rounded inline-block mb-2 ${getModuleColor(message.module)}`}>
                            {message.module}
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="text-xs text-muted-foreground mt-1 text-right">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="border-t p-3">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={activeModule ? `Ask about ${activeModule}...` : "Type your message..."}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Sidebar - only shown when expanded */}
            {isExpanded && (
              <div className="w-60 border-l overflow-hidden">
                <Tabs defaultValue="modules" className="h-full flex flex-col">
                  <TabsList className="grid grid-cols-3 mx-2 mt-2">
                    <TabsTrigger value="modules">Modules</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="ask">Ask</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="modules" className="flex-1 overflow-auto p-2">
                    <div className="space-y-1">
                      {modules.map((module) => (
                        <Button
                          key={module.id}
                          variant={activeModule === module.name ? "secondary" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleModuleSelect(module.name)}
                        >
                          <div className="mr-2">{module.icon}</div>
                          <span>{module.name}</span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="insights" className="flex-1 overflow-auto p-2">
                    <div className="space-y-2">
                      {insights.map((insight) => (
                        <div 
                          key={insight.id}
                          className="p-2 rounded border hover:border-business-200 hover:bg-muted/50 cursor-pointer"
                          onClick={() => {
                            const formattedInsight = `Tell me more about: ${insight.title}\n${insight.description}`;
                            setInput(formattedInsight);
                            setActiveModule(insight.module);
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {insight.icon}
                            <span className={`text-xs px-1.5 py-0.5 rounded ${getModuleColor(insight.module)}`}>
                              {insight.module}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium">{insight.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ask" className="flex-1 overflow-auto p-2">
                    <div className="mb-4 relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search questions..." className="pl-8" />
                    </div>
                    <h4 className="text-sm font-medium mb-2">Suggested Questions</h4>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          className="p-2 rounded border hover:border-business-200 hover:bg-muted/50 cursor-pointer"
                          onClick={() => {
                            handleSuggestionClick(suggestion.text);
                            if (suggestion.module) setActiveModule(suggestion.module);
                          }}
                        >
                          <p className="text-sm">{suggestion.text}</p>
                          {suggestion.module && (
                            <span className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${getModuleColor(suggestion.module)}`}>
                              {suggestion.module}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* Suggestion chips */}
          {!isExpanded && (
            <div className="px-4 py-2 flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => {
                  handleSuggestionClick("Show me recent sales data");
                  setActiveModule("Sales");
                }}
              >
                Sales data
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => {
                  handleSuggestionClick("Generate quarterly report");
                  setActiveModule("Finance");
                }}
              >
                Financial reports
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => {
                  handleSuggestionClick("Analyze marketing campaign performance");
                  setActiveModule("Marketing");
                }}
              >
                Marketing campaign
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EnhancedAiAssistant;
