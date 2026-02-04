export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chatId: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export interface SidebarProps {
  chats: Chat[];
  activeChatId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onRenameChat: (id: string, title: string) => void;
  onDeleteChat: (id: string) => void;
}

export interface ChatAreaProps {
  messages: Message[];
  onSend: (text: string) => void;
}

export interface ChatInputProps {
  onSend: (text: string) => void;
}