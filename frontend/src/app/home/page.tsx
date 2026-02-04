'use client';

import { io } from 'socket.io-client';
import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import Sidebar from '../../components/chat/Sidebar';
import ChatArea from '../../components/chat/ChatArea';
import DeleteModal from '../../components/modal/DeleteModal';
import { Chat, Message } from '../../types/chat';

const API_URL = 'http://localhost:3001/chats';

const ChatLayout = () => {
  const { data: session } = useSession();
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<{ id: string; title: string } | null>(null);

  const socket = useMemo(() => io('http://localhost:3001'), []);

  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (!userId) return;

    fetch(`${API_URL}?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const validData = Array.isArray(data) ? data : [];
        setChats(validData);
        if (validData.length > 0 && !activeChatId) {
          setActiveChatId(validData[0].id);
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        toast.error('Failed to load chat history');
      });
  }, [session]);

  useEffect(() => {
    const handleNewMsg = (msg: Message) => {
      setChats((prev) =>
        prev.map((c) => {
          if (c.id === msg.chatId) {
            const exists = c.messages?.some((m) => m.id === msg.id);
            return exists ? c : { ...c, messages: [...(c.messages || []), msg] };
          }
          return c;
        })
      );
    };

    const handleTyping = (data: { chatId: string; isTyping: boolean }) => {
      if (data.chatId === activeChatId) setIsTyping(data.isTyping);
    };

    socket.on('receiveMessage', handleNewMsg);
    socket.on('typingStatus', handleTyping);

    return () => {
      socket.off('receiveMessage');
      socket.off('typingStatus');
    };
  }, [activeChatId, socket]);

  const sendMessage = async (text: string) => {
    const userId = (session?.user as any)?.id;
    if (!text.trim() || !userId) return;

    let currentId = activeChatId;

    if (!currentId) {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: Number(userId), title: text.slice(0, 30) }),
        });
        if (!res.ok) throw new Error();
        const newChat = await res.json();
        currentId = newChat.id;
        setChats((prev) => [{ ...newChat, messages: [] }, ...prev]);
        setActiveChatId(currentId);
      } catch (err) {
        toast.error('Failed to create chat');
        return;
      }
    }

    try {
      const res = await fetch(`${API_URL}/${currentId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: text }),
      });
      if (!res.ok) throw new Error();
      const savedMsg = await res.json();
      
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentId ? { ...c, messages: [...(c.messages || []), savedMsg] } : c
        )
      );
    } catch (err) {
      toast.error('Error sending message');
    }
  };

  const openDeleteModal = (id: string) => {
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      setChatToDelete({ id: chat.id, title: chat.title || 'New Dialogue' });
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!chatToDelete) return;

    const deletePromise = fetch(`${API_URL}/${chatToDelete.id}`, {
      method: 'DELETE',
    }).then(async (res) => {
      if (!res.ok) throw new Error();
      setChats((prev) => prev.filter((c) => c.id !== chatToDelete.id));
      if (activeChatId === chatToDelete.id) setActiveChatId('');
      setIsDeleteModalOpen(false);
      setChatToDelete(null);
    });

    toast.promise(deletePromise, {
      loading: 'Deleting chat...',
      success: 'Chat deleted',
      error: 'Failed to delete chat',
    });
  };

  const activeChat = chats.find((c) => c.id === activeChatId) || { messages: [] };

  return (
    <div className="flex h-full w-full overflow-hidden bg-white dark:bg-black relative pt-16">
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed bottom-6 right-6 z-[100] bg-indigo-600 text-white p-4 rounded-full shadow-2xl active:scale-95 transition-all"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      <div className={`
        fixed md:relative inset-y-0 left-0 z-[90] 
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        w-72 bg-white dark:bg-zinc-950
      `}>
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelect={(id) => { setActiveChatId(id); setIsSidebarOpen(false); }}
          onNewChat={() => { setActiveChatId(''); setIsSidebarOpen(false); }}
          onDeleteChat={openDeleteModal}
          onRenameChat={() => {}} 
        />
      </div>
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] md:hidden"
        />
      )}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        <ChatArea
          messages={activeChat.messages || []}
          onSend={sendMessage}
          isTyping={isTyping}
        />
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        title={chatToDelete?.title || ''}
        onClose={() => { setIsDeleteModalOpen(false); setChatToDelete(null); }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ChatLayout;