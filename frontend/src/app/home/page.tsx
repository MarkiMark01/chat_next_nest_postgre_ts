'use client';

import { io, Socket } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

import Sidebar from '../../components/chat/Sidebar';
import ChatArea from '../../components/chat/ChatArea';
import DeleteModal from '../../components/modal/DeleteModal';
import { Chat, Message } from '../../types/chat';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_URL = `${BASE_URL}/chats`;

const ChatLayout = () => {
  const { data: session } = useSession();
  // Токен бекенду, який ми зберегли в сесії (див. [...nextauth]/route.ts)
  const token = (session as any)?.accessToken as string | undefined;

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  // Статус "друкує" зберігаємо окремо для кожного чату, щоб він не "залипав" при перемиканні
  const [typingByChat, setTypingByChat] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<{ id: string; title: string } | null>(null);

  // fetch, який додає токен. Якщо токен прострочений (401), виходимо з акаунта.
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 401) signOut();
    return res;
  };

  // Підключення до сокета (з токеном), відключення при виході зі сторінки
  useEffect(() => {
    if (!token) return;

    const newSocket = io(BASE_URL, {
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      withCredentials: true,
      auth: { token },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  // Завантаження чатів. userId більше не передаємо, бекенд бере його з токена
  useEffect(() => {
    if (!token) return;

    authFetch(API_URL)
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
  }, [token]);

  // Події сокета
  useEffect(() => {
    if (!socket) return;

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
      setTypingByChat((prev) => ({ ...prev, [data.chatId]: data.isTyping }));
    };

    const handleAiError = (data: { chatId: string; message: string }) => {
      toast.error(data.message);
    };

    socket.on('receiveMessage', handleNewMsg);
    socket.on('typingStatus', handleTyping);
    socket.on('aiError', handleAiError);

    return () => {
      socket.off('receiveMessage', handleNewMsg);
      socket.off('typingStatus', handleTyping);
      socket.off('aiError', handleAiError);
    };
  }, [socket]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !token) return;

    let currentId = activeChatId;

    if (!currentId) {
      try {
        const res = await authFetch(API_URL, {
          method: 'POST',
          body: JSON.stringify({ title: text.slice(0, 30) }),
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
      const res = await authFetch(`${API_URL}/${currentId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: text }), // role більше не надсилаємо
      });
      if (res.status === 409) {
        toast.error('Please wait for the current answer');
        return;
      }
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

    const deletePromise = authFetch(`${API_URL}/${chatToDelete.id}`, {
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
  const isTyping = !!typingByChat[activeChatId];

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