import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  username: string;
  content: string;
  timestamp: string;
  chatId: string;
}

interface ChatRoom {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const ChatSection = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [newChatIcon, setNewChatIcon] = useState('MessageSquare');
  const [newChatDesc, setNewChatDesc] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedRooms = localStorage.getItem('darkHavenChatRooms');
    if (savedRooms) {
      setChatRooms(JSON.parse(savedRooms));
    } else {
      const defaultRooms: ChatRoom[] = [
        { id: 'general', name: 'Общий', icon: 'MessageSquare', description: 'Общий чат для всех' },
        { id: 'trade', name: 'Торговля', icon: 'ShoppingCart', description: 'Обмен и продажа' },
        { id: 'help', name: 'Помощь', icon: 'HelpCircle', description: 'Вопросы новичков' }
      ];
      setChatRooms(defaultRooms);
      localStorage.setItem('darkHavenChatRooms', JSON.stringify(defaultRooms));
    }

    const savedMessages = localStorage.getItem('darkHavenChatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChatId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const user = JSON.parse(localStorage.getItem('darkHavenUser') || '{"username":"Гость"}');
    
    const message: Message = {
      id: Date.now(),
      username: user.username,
      content: newMessage,
      timestamp: new Date().toISOString(),
      chatId: activeChatId
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('darkHavenChatMessages', JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  const handleCreateChat = () => {
    if (!newChatName.trim()) return;

    const newRoom: ChatRoom = {
      id: `chat-${Date.now()}`,
      name: newChatName,
      icon: newChatIcon,
      description: newChatDesc
    };

    const updated = [...chatRooms, newRoom];
    setChatRooms(updated);
    localStorage.setItem('darkHavenChatRooms', JSON.stringify(updated));
    
    setIsCreatingChat(false);
    setNewChatName('');
    setNewChatIcon('MessageSquare');
    setNewChatDesc('');
    setActiveChatId(newRoom.id);
  };

  const handleDeleteChat = (id: string) => {
    if (id === 'general') return;
    const updated = chatRooms.filter(r => r.id !== id);
    setChatRooms(updated);
    localStorage.setItem('darkHavenChatRooms', JSON.stringify(updated));
    if (activeChatId === id) setActiveChatId('general');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const activeChat = chatRooms.find(r => r.id === activeChatId);
  const chatMessages = messages.filter(m => m.chatId === activeChatId);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-4xl font-bold glow-cyan mb-2">Чат</h2>
        <p className="text-muted-foreground">Общение с игроками сообщества</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 bg-card/50 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Комнаты</span>
              <Button size="sm" variant="ghost" onClick={() => setIsCreatingChat(true)}>
                <Icon name="Plus" size={16} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {chatRooms.map(room => (
                <div key={room.id} className="group relative">
                  <Button
                    variant={activeChatId === room.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveChatId(room.id)}
                  >
                    <Icon name={room.icon as any} size={16} className="mr-2" />
                    {room.name}
                  </Button>
                  {room.id !== 'general' && (
                    <button
                      onClick={() => handleDeleteChat(room.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="X" size={14} className="text-destructive" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-card/50 border-border backdrop-blur-sm">
          {isCreatingChat ? (
            <>
              <CardHeader>
                <CardTitle>Создать чат</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Название чата" value={newChatName} onChange={(e) => setNewChatName(e.target.value)} />
                <Input placeholder="Иконка (напр. MessageSquare)" value={newChatIcon} onChange={(e) => setNewChatIcon(e.target.value)} />
                <Input placeholder="Описание" value={newChatDesc} onChange={(e) => setNewChatDesc(e.target.value)} />
                <div className="flex gap-2">
                  <Button onClick={handleCreateChat}>Создать</Button>
                  <Button variant="outline" onClick={() => setIsCreatingChat(false)}>Отмена</Button>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name={activeChat?.icon as any || 'MessageSquare'} size={24} className="text-primary" />
                  <div>
                    <div>{activeChat?.name || 'Чат'}</div>
                    <p className="text-sm text-muted-foreground font-normal">{activeChat?.description}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[450px] pr-4 mb-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Icon name="User" size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold">{message.username}</span>
                            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                          </div>
                          <p className="text-muted-foreground">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Введите сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} className="animate-pulse-glow">
                    <Icon name="Send" size={16} />
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ChatSection;
