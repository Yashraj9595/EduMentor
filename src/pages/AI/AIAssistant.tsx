import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Lightbulb, 
  FileText, 
  Trophy, 
  Users, 
  Loader,
  Copy
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestions?: string[];
  isTyping?: boolean;
}

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
}

export const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeFeature] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      content: `Hello ${user?.firstName}! I'm your AI assistant. I can help you with project ideas, abstract writing, hackathon preparation, and more. How can I assist you today?`,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Generate project ideas',
        'Help with abstract writing',
        'Hackathon preparation tips',
        'Mentor selection advice'
      ]
    };
    setMessages([welcomeMessage]);
  }, [user]);

  const aiFeatures: AIFeature[] = [
    {
      id: 'project-ideas',
      title: 'Project Idea Generator',
      description: 'Get AI-powered project suggestions based on your skills and interests',
      icon: Lightbulb,
      action: () => generateProjectIdeas()
    },
    {
      id: 'abstract-helper',
      title: 'Abstract Helper',
      description: 'Get help writing and formatting your project abstract',
      icon: FileText,
      action: () => helpWithAbstract()
    },
    {
      id: 'hackathon-prep',
      title: 'Hackathon Preparation',
      description: 'Get tips and strategies for hackathon success',
      icon: Trophy,
      action: () => hackathonPreparation()
    },
    {
      id: 'mentor-advice',
      title: 'Mentor Selection',
      description: 'Get advice on choosing the right mentor for your project',
      icon: Users,
      action: () => mentorAdvice()
    }
  ];

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
    }, 2000);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('project') || input.includes('idea')) {
      return {
        content: `Based on current trends and your profile, here are some innovative project ideas:

**AI & Machine Learning:**
• Healthcare AI Assistant for symptom analysis
• Smart Agriculture IoT system with crop monitoring
• AI-powered Code Review tool for developers

**Web Development:**
• Real-time Collaboration Platform for students
• Sustainable Living Tracker with carbon footprint
• Community-based Learning Management System

**Mobile Development:**
• Mental Health Companion app with mood tracking
• Local Business Discovery with AR features
• Emergency Response Network for campus safety

Would you like me to elaborate on any of these ideas or generate more specific suggestions?`,
        suggestions: ['Tell me more about AI projects', 'Show me web development ideas', 'Mobile app suggestions']
      };
    }
    
    if (input.includes('abstract') || input.includes('writing')) {
      return {
        content: `I'll help you write a compelling project abstract! Here's a structured approach:

**Abstract Structure:**
1. **Problem Statement** (2-3 sentences)
   - What problem are you solving?
   - Why is it important?

2. **Solution Overview** (3-4 sentences)
   - Your proposed solution
   - Key technologies/methods used

3. **Expected Outcomes** (2-3 sentences)
   - What results do you expect?
   - How will it benefit users?

4. **Innovation Factor** (1-2 sentences)
   - What makes your approach unique?

Would you like me to help you draft an abstract for your specific project?`,
        suggestions: ['Help me write an abstract', 'Review my existing abstract', 'Abstract template']
      };
    }
    
    if (input.includes('hackathon') || input.includes('preparation')) {
      return {
        content: `Here's your comprehensive hackathon preparation guide:

**Pre-Hackathon (1-2 weeks before):**
• Research the theme and prepare initial ideas
• Set up your development environment
• Practice with your team on small projects
• Prepare a pitch template

**During Hackathon:**
• Start with a simple MVP (Minimum Viable Product)
• Focus on one core feature that works well
• Document your process and decisions
• Prepare a compelling demo

**Pitching Tips:**
• Start with the problem you're solving
• Show, don't just tell - use demos
• Explain the impact and scalability
• Practice your 2-minute pitch

**Technical Tips:**
• Use familiar technologies
• Plan for deployment early
• Have backup plans for technical issues
• Focus on user experience

Need specific advice for your hackathon?`,
        suggestions: ['Pitch deck template', 'Technical stack advice', 'Team formation tips']
      };
    }
    
    if (input.includes('mentor') || input.includes('guidance')) {
      return {
        content: `Here's how to choose the right mentor for your project:

**Mentor Selection Criteria:**
• **Expertise Match**: Look for mentors with experience in your project domain
• **Availability**: Check their current workload and response time
• **Communication Style**: Find someone whose mentoring style matches your learning preference
• **Past Experience**: Review their previous mentorship success stories

**Questions to Ask Potential Mentors:**
• What's your preferred communication frequency?
• How do you typically provide feedback?
• What's your experience with projects similar to mine?
• What are your expectations from mentees?

**Making the Most of Mentorship:**
• Be specific about what help you need
• Come prepared to meetings with questions
• Implement feedback and show progress
• Maintain regular communication

Would you like me to help you identify potential mentors or prepare questions for them?`,
        suggestions: ['Find mentors in my field', 'Prepare mentor questions', 'Mentorship best practices']
      };
    }
    
    // Default response
    return {
      content: `I understand you're asking about "${userInput}". I can help you with:

• **Project Ideas**: Generate innovative project suggestions
• **Abstract Writing**: Help structure and write project abstracts  
• **Hackathon Prep**: Tips for hackathon success
• **Mentor Selection**: Advice on choosing the right mentor
• **General Questions**: Answer questions about the platform

What specific area would you like help with?`,
      suggestions: ['Project ideas', 'Abstract help', 'Hackathon tips', 'Mentor advice']
    };
  };

  const generateProjectIdeas = () => {
    const ideas = [
      'AI-powered Study Assistant for personalized learning',
      'Blockchain-based Certificate Verification System',
      'IoT Smart Campus with energy monitoring',
      'AR/VR Virtual Lab for science experiments',
      'Machine Learning Model for predicting academic performance'
    ];
    
    const response: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Here are some trending project ideas based on current technology trends:

${ideas.map((idea, index) => `${index + 1}. ${idea}`).join('\n')}

Each of these projects addresses real-world problems and can be scaled for different applications. Would you like me to elaborate on any specific idea or generate more suggestions in a particular domain?`,
      timestamp: new Date().toISOString(),
      suggestions: ['Tell me more about AI projects', 'Show me IoT ideas', 'Web development projects']
    };
    
    setMessages(prev => [...prev, response]);
  };

  const helpWithAbstract = () => {
    const response: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `I'll help you write a compelling project abstract! Here's a step-by-step guide:

**Step 1: Problem Statement**
Start by clearly defining the problem your project addresses. Be specific about the pain points and why this problem matters.

**Step 2: Your Solution**
Describe your proposed solution in 2-3 sentences. Focus on the key innovation or approach you're taking.

**Step 3: Methodology**
Briefly explain the technologies, tools, or methods you'll use to implement your solution.

**Step 4: Expected Impact**
Describe the potential benefits and impact of your project.

**Step 5: Innovation Factor**
Highlight what makes your approach unique or novel.

Would you like me to help you draft an abstract for your specific project? Just tell me about your project and I'll guide you through writing each section.`,
      timestamp: new Date().toISOString(),
      suggestions: ['Help me write my abstract', 'Review my existing abstract', 'Abstract template']
    };
    
    setMessages(prev => [...prev, response]);
  };

  const hackathonPreparation = () => {
    const response: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Here's your complete hackathon preparation strategy:

**Pre-Hackathon Checklist:**
✅ Research the hackathon theme and judging criteria
✅ Prepare 3-5 project ideas in advance
✅ Set up your development environment
✅ Practice with your team on small projects
✅ Prepare a pitch deck template

**During the Hackathon:**
• Start with a simple MVP - one core feature that works
• Focus on user experience and functionality
• Document your process and decisions
• Prepare a compelling 2-minute demo

**Pitching Success Tips:**
• Start with the problem you're solving
• Show your demo, don't just describe it
• Explain the impact and scalability
• Practice your pitch multiple times

**Technical Best Practices:**
• Use familiar technologies
• Plan for deployment early
• Have backup plans for technical issues
• Focus on clean, working code

Need specific advice for your upcoming hackathon?`,
      timestamp: new Date().toISOString(),
      suggestions: ['Pitch deck template', 'Technical stack advice', 'Team formation tips']
    };
    
    setMessages(prev => [...prev, response]);
  };

  const mentorAdvice = () => {
    const response: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Here's how to find and work with the right mentor:

**Finding the Right Mentor:**
• Look for expertise in your project domain
• Check their availability and communication style
• Review their past mentorship experience
• Consider their industry connections

**Questions to Ask Potential Mentors:**
• What's your preferred communication frequency?
• How do you typically provide feedback?
• What are your expectations from mentees?
• What's your experience with similar projects?

**Making the Most of Mentorship:**
• Be specific about what help you need
• Come prepared to meetings with questions
• Implement feedback and show progress
• Maintain regular communication

**Red Flags to Avoid:**
• Mentors who are too busy to respond
• Those who don't understand your project domain
• Mentors with poor communication skills

Would you like me to help you identify potential mentors or prepare questions for them?`,
      timestamp: new Date().toISOString(),
      suggestions: ['Find mentors in my field', 'Prepare mentor questions', 'Mentorship best practices']
    };
    
    setMessages(prev => [...prev, response]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* AI Features Sidebar */}
      <div className="w-80 bg-card border-r border-border p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
            <Bot className="w-6 h-6 text-primary" />
            AI Assistant
          </h2>
          <p className="text-sm text-muted-foreground">
            Get AI-powered help with your projects and academic journey
          </p>
        </div>

        <div className="space-y-3">
          {aiFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={feature.action}
                className={`w-full p-4 rounded-lg border transition-colors text-left ${
                  activeFeature === feature.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">Always here to help</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-lg px-4 py-2 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
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
                
                <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.type === 'ai' && (
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="ml-2 p-1 hover:bg-muted rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-card border-t border-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything about your projects..."
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isTyping}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
