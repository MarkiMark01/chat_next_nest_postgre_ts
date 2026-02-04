'use client';
import { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSend }: { onSend: (val: string) => void }) => {
  const [value, setValue] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const submit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue('');
  };

  return (
    <div className="relative flex items-end gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 focus-within:ring-1 ring-zinc-400 transition-all">
      <textarea
        ref={textAreaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Type a message..."
        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-3 py-2 text-[15px] resize-none max-h-[200px] overflow-y-auto text-zinc-800 dark:text-zinc-100"
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        className={`shrink-0 p-2.5 rounded-xl transition-all cursor-pointer ${
          value.trim() 
            ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' 
            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
        }`}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;