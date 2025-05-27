import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  rental_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender_email?: string;
}

interface MessageSystemProps {
  rentalId: string;
  ownerId: string;
  renterId: string;
}

export function MessageSystem({ rentalId, ownerId, renterId }: MessageSystemProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up polling instead of realtime subscription
    const pollingInterval = setInterval(() => {
      fetchMessages();
    }, 3000); // Poll every 3 seconds

    return () => {
      clearInterval(pollingInterval);
    };
  }, [rentalId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('rental_id', rentalId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get user emails for display
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(msg => msg.sender_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds);

        const messagesWithSenders = data.map(msg => {
          const sender = profiles?.find(p => p.id === msg.sender_id);
          return {
            ...msg,
            sender_email: sender?.email || 'Unknown user'
          };
        });

        setMessages(messagesWithSenders);
      } else {
        setMessages([]);
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error loading messages',
        description: error.message || 'Failed to load messages',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          rental_id: rentalId,
          sender_id: user.id,
          message: newMessage.trim()
        });

      if (error) throw error;
      setNewMessage('');
      
      // Fetch messages immediately after sending
      await fetchMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isCurrentUserMessage = (senderId: string) => {
    return user?.id === senderId;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden" style={{ height: '400px' }}>
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-4 pb-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <Card 
                    key={msg.id} 
                    className={`max-w-[80%] ${isCurrentUserMessage(msg.sender_id) ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto bg-muted'}`}
                  >
                    <CardContent className="p-3">
                      <div className="text-xs font-medium mb-1">
                        {isCurrentUserMessage(msg.sender_id) ? 'You' : msg.sender_email}
                      </div>
                      <div>{msg.message}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t flex gap-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button 
          onClick={sendMessage} 
          disabled={loading || !newMessage.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
