import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, Activity, Pill, FileText, Plus, MessageSquare } from 'lucide-react';
import { sendChatMessage, getChatHistory } from '../services/api';
import Button from '../components/common/Button';

export default function AIAssistant() {
  // Session & Data State
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [messages, setMessages] = useState([]); // Messages for current session
  const [allHistory, setAllHistory] = useState([]); // All messages across sessions

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef(null);
  
  const messagesEndRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          handleSend(transcript, true);
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Fetch History on Mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await getChatHistory();
      if (history && history.length > 0) {
        const historyOldestFirst = history.reverse();
        setAllHistory(historyOldestFirst);
        groupSessions(historyOldestFirst);
      } else {
        startNewChat();
      }
    } catch (err) {
      console.error("Failed to load chat history", err);
      startNewChat();
    }
  };

  const groupSessions = (history) => {
    // Group messages by session_id
    const sessionMap = new Map();
    history.forEach(h => {
      if (!sessionMap.has(h.session_id)) {
        sessionMap.set(h.session_id, {
          id: h.session_id,
          title: h.message || 'New Chat',
          timestamp: new Date(h.created_at),
          messages: []
        });
      }
      
      const session = sessionMap.get(h.session_id);
      const timeStr = new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (h.message) {
        session.messages.push({ id: `u-${h.id}`, text: h.message, sender: 'user', timestamp: timeStr, isVoice: h.is_voice });
      }
      if (h.response) {
        session.messages.push({ id: `a-${h.id}`, text: h.response, sender: 'ai', timestamp: timeStr, agentUsed: h.agent_used });
      }
    });

    const sessionList = Array.from(sessionMap.values()).sort((a, b) => b.timestamp - a.timestamp);
    
    // Categorize by time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const categorized = {
      'Today': [],
      'Yesterday': [],
      'Previous 7 Days': [],
      'Older': []
    };

    sessionList.forEach(s => {
      const d = s.timestamp;
      if (d >= today) categorized['Today'].push(s);
      else if (d >= yesterday) categorized['Yesterday'].push(s);
      else if (d >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) categorized['Previous 7 Days'].push(s);
      else categorized['Older'].push(s);
    });

    setSessions(categorized);
    
    // If no active session, pick the most recent one or create new
    if (sessionList.length > 0 && !currentSessionId) {
      selectSession(sessionList[0].id, sessionList[0].messages);
    }
  };

  const startNewChat = () => {
    const newId = crypto.randomUUID();
    setCurrentSessionId(newId);
    setMessages([]);
  };

  const selectSession = (id, msgs) => {
    setCurrentSessionId(id);
    setMessages(msgs || []);
  };

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error("Microphone in use or error", e);
        }
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const speak = (text) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend = input, isVoiceInput = false) => {
    const msg = textToSend.trim();
    if (!msg) return;

    // Make sure we have a session ID
    const activeSessionId = currentSessionId || crypto.randomUUID();
    if (!currentSessionId) setCurrentSessionId(activeSessionId);

    setInput('');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Optimistic UI update
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: `u-${userMsgId}`, text: msg, sender: 'user', timestamp: now, isVoice: isVoiceInput }]);
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendChatMessage(msg, activeSessionId, isVoiceInput);
      
      const aiMsg = { 
        id: `a-${result.id}`, 
        text: result.response, 
        sender: 'ai', 
        timestamp: new Date(result.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentUsed: result.agent_used
      };
      
      setMessages(prev => [...prev, aiMsg]);

      // Refresh history silently to update sidebar groupings
      getChatHistory().then(history => {
        if (history) {
          const historyOldestFirst = history.reverse();
          setAllHistory(historyOldestFirst);
          groupSessions(historyOldestFirst);
        }
      });

      if (isVoiceInput) {
        speak(result.response);
      }
    } catch (err) {
      setError(err.message || "Failed to get response from Assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    { text: "Explain my active prescriptions", icon: FileText },
    { text: "What is Metformin used for?", icon: Pill },
    { text: "I have a fever and sore throat", icon: Activity },
    { text: "Tips for better sleep", icon: Sparkles }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center justify-between text-white flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">AI Health Assistant</h2>
            <p className="text-blue-100 text-xs font-medium">Powered by Gemini Multi-Agent System</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={isMuted ? "Unmute Voice Responses" : "Mute Voice Responses"}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for History */}
        <div className="hidden md:flex flex-col w-64 bg-gray-50 border-r border-gray-100">
          <div className="p-4">
            <Button 
              variant="outline" 
              onClick={startNewChat}
              className="w-full justify-start gap-2 border-dashed border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-4">
            {Object.entries(sessions).map(([period, periodSessions]) => {
              if (periodSessions.length === 0) return null;
              return (
                <div key={period}>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">{period}</h4>
                  <div className="space-y-1">
                    {periodSessions.map(s => (
                      <button
                        key={s.id}
                        onClick={() => selectSession(s.id, s.messages)}
                        className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentSessionId === s.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <MessageSquare className={`h-4 w-4 flex-shrink-0 ${currentSessionId === s.id ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className="truncate flex-1">{s.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Bot className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">How can I help you today?</h3>
                  <p className="text-gray-500 mt-2 text-sm">
                    I can explain your prescriptions, check symptoms, provide medicine details, or answer general health questions.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-4">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt.text, false)}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-left group"
                    >
                      <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <prompt.icon className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{prompt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto w-full">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[85%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {msg.sender === 'user' ? (
                          <div className="bg-gray-200 p-2 rounded-full h-9 w-9 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        ) : (
                          <div className="bg-blue-600 p-2 rounded-full h-9 w-9 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-3 rounded-2xl ${
                          msg.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm' 
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                        }`}>
                          <div className="whitespace-pre-wrap text-[15px] leading-relaxed font-normal">
                            {msg.text}
                          </div>
                        </div>
                        
                        {/* Meta info underneath */}
                        <div className="flex items-center gap-2 mt-1 px-1">
                          <span className="text-xs text-gray-400 font-medium">{msg.timestamp}</span>
                          {msg.agentUsed && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-100">
                              {msg.agentUsed.replace('_', ' ')}
                            </span>
                          )}
                          {msg.isVoice && (
                            <Mic className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[85%] gap-3 flex-row">
                      <div className="bg-blue-600 p-2 rounded-full h-9 w-9 flex items-center justify-center flex-shrink-0">
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      </div>
                      <div className="bg-white border border-gray-200 text-gray-500 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-[15px] flex items-center gap-2">
                        <span className="animate-pulse">Assistant is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="text-center p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 mx-auto max-w-md">
                    {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
              <button 
                onClick={toggleListening}
                className={`p-3 rounded-xl flex-shrink-0 transition-all shadow-sm border ${
                  isListening 
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 animate-pulse' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(input, false);
                    }
                  }}
                  placeholder={isListening ? "Listening..." : "Message Health Assistant..."}
                  className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none shadow-sm"
                  rows="1"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                  disabled={isListening || isLoading}
                />
              </div>
              
              <Button 
                variant="primary" 
                onClick={() => handleSend(input, false)} 
                disabled={!input.trim() || isLoading || isListening}
                className="flex-shrink-0 px-4 py-3 h-12 shadow-sm"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400">AI-generated responses. Not medical advice. Always consult a doctor.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
