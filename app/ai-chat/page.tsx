'use client'; // PHẢI LÀ DÒNG ĐẦU TIÊN

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, UserIcon, Sparkles } from './components/icons';
import { Message } from './types';
import { createChat } from './services/geminiService';
import type { Chat } from './services/geminiService';

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI của ứng dụng Đổi đồ cũ. Tôi có thể giúp bạn tìm kiếm đồ, đăng đồ, hoặc trả lời các câu hỏi về ứng dụng. Bạn cần hỗ trợ gì?',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  // Cuộn tin nhắn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (messageText: string, currentMessages: Message[]) => {
    setLoading(true);

    if (!chatRef.current) {
      chatRef.current = createChat(currentMessages);
    }

    try {
      const chat = chatRef.current;
      const stream = await chat.sendMessageStream({ message: messageText });

      const aiMessageId = (Date.now() + 1).toString();
      let fullResponse = '';

      setMessages(prev => [...prev, { id: aiMessageId, role: 'assistant', content: '', timestamp: new Date() }]);

      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages(prev =>
          prev.map(msg => (msg.id === aiMessageId ? { ...msg, content: fullResponse } : msg))
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = () => {
    if (!input.trim() || loading) return;

    const messageText = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    handleSendMessage(messageText, newMessages);
  };

  const sendQuickQuestion = (question: string) => {
    if (loading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: question, timestamp: new Date() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    handleSendMessage(question, newMessages);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'Làm sao để đăng đồ?',
    'Cách tìm kiếm đồ?',
    'Quy trình đổi đồ như thế nào?',
    'QR code là gì?',
    'Hệ thống uy tín hoạt động ra sao?',
  ];

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-4xl h-[calc(100vh-40px)] flex flex-col shadow-2xl rounded-xl">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Chat với AI</h1>
              <p className="text-primary-100 text-sm">Trợ lý thông minh hỗ trợ bạn sử dụng ứng dụng</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white text-gray-900 shadow-md'}`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-primary-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {loading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white rounded-lg px-4 py-3 shadow-md">
                <div className="flex gap-1 items-center h-full">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="bg-white p-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Câu hỏi nhanh:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendQuickQuestion(question)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-4 border-t rounded-b-xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
