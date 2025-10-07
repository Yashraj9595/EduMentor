import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Loader
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestions?: string[];
  isTyping?: boolean;
}

interface FloatingAIProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const FloatingAI: React.FC<FloatingAIProps> = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'ai',
        content: `Hi ${user?.firstName}! 👋 I'm your AI assistant. How can I help you today?`,
        timestamp: new Date().toISOString(),
        suggestions: [
          'Project ideas',
          'Abstract help',
          'Hackathon tips',
          'Mentor advice'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user, messages.length]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        suggestions: aiResponse.suggestions
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('project') || input.includes('idea')) {
      return {
        content: `🚀 Here are some trending project ideas:

**AI & ML Projects:**
• Healthcare AI Assistant
• Smart Agriculture IoT
• AI Code Review Tool

**Web Development:**
• Real-time Collaboration Platform
• Sustainable Living Tracker
• Community Learning System

**Mobile Apps:**
• Mental Health Companion
• AR Business Discovery
• Campus Safety Network

Which area interests you most?`,
        suggestions: ['AI projects', 'Web development', 'Mobile apps']
      };
    }
    
    if (input.includes('abstract') || input.includes('writing')) {
      return {
        content: `📝 I'll help you write a great abstract! Here's the structure:

**1. Problem Statement** (2-3 sentences)
- What problem are you solving?
- Why is it important?

**2. Solution Overview** (3-4 sentences)
- Your proposed solution
- Key technologies used

**3. Expected Outcomes** (2-3 sentences)
- What results do you expect?
- How will it benefit users?

**4. Innovation Factor** (1-2 sentences)
- What makes your approach unique?

Ready to start? Tell me about your project!`,
        suggestions: ['Help me write', 'Review my abstract', 'Abstract template']
      };
    }
    
    if (input.includes('hackathon') || input.includes('preparation')) {
      return {
        content: `🏆 Hackathon Success Guide:

**Pre-Hackathon:**
✅ Research theme & judging criteria
✅ Prepare 3-5 project ideas
✅ Set up dev environment
✅ Practice with your team

**During Hackathon:**
• Start with simple MVP
• Focus on one core feature
• Document your process
• Prepare compelling demo

**Pitching Tips:**
• Start with the problem
• Show, don't just tell
• Explain impact & scalability
• Practice your 2-minute pitch

Need specific advice?`,
        suggestions: ['Pitch deck help', 'Technical advice', 'Team tips']
      };
    }
    
    if (input.includes('mentor') || input.includes('guidance')) {
      return {
        content: `👨‍🏫 Finding the Right Mentor:

**Selection Criteria:**
• Expertise in your domain
• Good communication style
• Past mentorship experience
• Industry connections

**Questions to Ask:**
• Communication frequency?
• Feedback style?
• Expectations from mentees?
• Experience with similar projects?

**Making the Most:**
• Be specific about help needed
• Come prepared to meetings
• Implement feedback
• Maintain regular contact

Want help finding mentors?`,
        suggestions: ['Find mentors', 'Prepare questions', 'Best practices']
      };
    }
    
    // Default response
    return {
      content: `I can help you with:

🤖 **Project Ideas** - Generate innovative suggestions
📝 **Abstract Writing** - Structure and write abstracts  
🏆 **Hackathon Prep** - Tips for success
👨‍🏫 **Mentor Selection** - Choose the right mentor
❓ **General Questions** - Platform help

What would you like help with?`,
      suggestions: ['Project ideas', 'Abstract help', 'Hackathon tips', 'Mentor advice']
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-24 right-6 z-[9998]">
        <button
          onClick={onToggle}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 relative"
        >
          <Bot className="w-6 h-6" />
          {/* Notification indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </button>
        {/* Floating label */}
        <div className="absolute -top-12 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          AI Assistant
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-[9998]">
      <div className={`bg-background border border-border rounded-lg shadow-xl transition-all duration-300 ${
        isMinimized ? 'w-96 h-16' : 'w-96 h-[500px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex flex-col h-[450px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-sm ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-lg px-3 py-2 text-sm ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                    
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className={`text-xs text-muted-foreground mt-1 ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything..."
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isTyping}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTyping ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
