import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Send, Bot, User, Hotel as HotelIcon } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface FormData {
  message: string;
}

const Hotel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, watch } = useForm<FormData>({
    defaultValues: {
      message: '',
    },
  });

  const watchedMessage = watch('message');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (data: FormData) => {
    if (!data.message.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: data.message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentQuestion = data.message;
    reset();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/hotel', {
        question: currentQuestion,
      });

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.data,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('API 요청 실패:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: '죄송합니다. 서버와의 연결에 문제가 발생했습니다.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(sendMessage)();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="min-h-screen flex flex-col">
        {/* 헤더 */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-slate-900 rounded-lg">
                <HotelIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-light text-slate-900 tracking-wide">
                  LuxeStay Hotel
                </h1>
                <p className="text-sm text-slate-600 font-light tracking-wider uppercase">
                  Personal Concierge
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 max-w-4xl mx-auto w-full p-6 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 max-w-lg mx-auto">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bot className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-light text-slate-900 mb-3">
                    How may I assist you today?
                  </h3>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Welcome to LuxeStay Hotel. I'm here to help with any
                    inquiries about our services and amenities.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    <span className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-700 transition-colors duration-200">
                      Check-in Times
                    </span>
                    <span className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-700 transition-colors duration-200">
                      Room Service
                    </span>
                    <span className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-700 transition-colors duration-200">
                      Amenities
                    </span>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? 'justify-end' : 'justify-start'
                } mb-4`}
              >
                <div className="flex items-start space-x-3 max-w-[75%]">
                  {!message.isUser && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`px-5 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                      message.isUser
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-800 border border-slate-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed font-light">
                      {message.text}
                    </p>
                    <div
                      className={`text-xs mt-2 ${
                        message.isUser ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  {message.isUser && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start space-x-3 max-w-[75%]">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-sm px-5 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
                        style={{ animationDelay: '0.4s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="relative">
            <form onSubmit={handleSubmit(sendMessage)}>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1 pr-[0.5rem]">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    {...register('message')}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-5 py-3 bg-transparent text-slate-800 placeholder-slate-500 focus:outline-none font-light"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !watchedMessage?.trim()}
                    className="px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed font-light shadow-sm transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotel;
