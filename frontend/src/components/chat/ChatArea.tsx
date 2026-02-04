'use client';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { Message } from '../../types/chat';

interface ChatAreaProps {
  messages: Message[];
  onSend: (text: string) => void;
  isTyping: boolean;
}

const ChatArea = ({ messages, onSend, isTyping }: ChatAreaProps) => {
  return (
    <section className="flex flex-col h-full w-full min-w-0 bg-white dark:bg-black overflow-hidden">
      <div className="flex-1 min-h-0 relative">
        {messages.length === 0 && !isTyping ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 p-4 text-center">
            <h1 className="text-2xl font-semibold mb-2 text-zinc-800 dark:text-zinc-200">QuickChat</h1>
            <p className="text-sm">How can I help you today?</p>
          </div>
        ) : (
          <MessageList messages={messages} isTyping={isTyping} />
        )}
      </div>
      
      <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2 shrink-0">
        <ChatInput onSend={onSend} />
        <p className="text-[11px] text-center text-zinc-400 mt-3">
          QuickChat can make mistakes. Check important info.
        </p>
      </div>
    </section>
  );
};
export default ChatArea;