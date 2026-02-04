'use client';
import { SidebarProps } from '../../types/chat';

const Sidebar = ({ chats, activeChatId, onSelect, onNewChat, onDeleteChat }: SidebarProps) => {
  return (
    <aside className="flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 h-full w-full shrink-0 overflow-hidden">
      <div className="p-4 shrink-0 mt-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-90 transition-all active:scale-[0.98] shadow-md group cursor-pointer"
        >
          <span>New Chat</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 custom-scrollbar">
        <h2 className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.1em]">
          Your History
        </h2>
        
        {chats.map(chat => (
          <div key={chat.id} className="group relative flex items-center">
            <button
              onClick={() => onSelect(chat.id)}
              className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-all truncate pr-10 cursor-pointer ${
                chat.id === activeChatId
                  ? 'bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-700 text-zinc-900 dark:text-zinc-100'
                  : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {chat.title || "New Dialogue"}
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="absolute right-2 p-1.5 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;