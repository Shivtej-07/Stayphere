import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, MapPin, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your AI Travel Assistant. 🌍 Where would you like to go today? I can help you find beaches, mountains, or stays within your budget!", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI processing delay
        setTimeout(() => {
            const botResponse = generateResponse(userMessage.text);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse.text, sender: 'bot', action: botResponse.action }]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (text) => {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('beach') || lowerText.includes('sea') || lowerText.includes('ocean')) {
            return {
                text: "For a beach getaway, I highly recommend checking out our stays in Maldives or Goa! 🏖️ Would you like to see available beach stays?",
                action: { label: "View Beach Stays", path: "/stays?type=beach" }
            };
        }
        if (lowerText.includes('mountain') || lowerText.includes('hill') || lowerText.includes('snow')) {
            return {
                text: "The mountains are calling! 🏔️ Manali and Switzerland have some cozy cabins right now. Shall I take you there?",
                action: { label: "Explore Mountains", path: "/stays?type=mountain" }
            };
        }
        if (lowerText.includes('price') || lowerText.includes('cheap') || lowerText.includes('budget') || lowerText.includes('cost')) {
            return {
                text: "We have stays for every budget! You can filter by price range on our Stays page. 💰",
                action: { label: "Filter by Price", path: "/stays" }
            };
        }
        if (lowerText.includes('transport') || lowerText.includes('flight') || lowerText.includes('car')) {
            return {
                text: "Need a ride? Check out our Transport section for flights and car rentals! ✈️🚗",
                action: { label: "Go to Transport", path: "/transport" }
            };
        }
        if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
            return { text: "Hello there! 👋 Ready to plan your next adventure?" };
        }

        return { text: "I'm not sure about that specific place yet, but you can browse all our amazing destinations on the Stays page! 🌏", action: { label: "Browse All Stays", path: "/stays" } };
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 md:w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up origin-bottom-right">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <Sparkles size={18} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">AI Travel Assistant</h3>
                                <p className="text-white/80 text-xs flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2 flex-shrink-0 shadow-lg">
                                        <Bot size={14} className="text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-md ${msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                                    }`}>
                                    {msg.text}
                                    {msg.action && (
                                        <button
                                            onClick={() => {
                                                navigate(msg.action.path);
                                                setIsOpen(false);
                                            }}
                                            className="mt-3 flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-all w-full justify-center border border-white/5"
                                        >
                                            <MapPin size={12} />
                                            <span>{msg.action.label}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2 flex-shrink-0">
                                    <Bot size={14} className="text-white" />
                                </div>
                                <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center space-x-1">
                                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-900/50 border-t border-white/10 backdrop-blur-md">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about beaches, mountains..."
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-sm"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="absolute right-2 p-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen
                        ? 'bg-slate-800 text-white rotate-90'
                        : 'bg-gradient-to-r from-primary to-secondary text-white animate-bounce-slow'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
};

export default ChatAssistant;
