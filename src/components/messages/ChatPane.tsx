import React, { useRef, useEffect, useCallback } from 'react';
import { useMessageStore } from '@/stores/messageStore';
import { MessageBubble } from './MessageBubble';
import './ChatPane.css';

interface ChatPaneProps {
  conversationId: number;
}

export const ChatPane: React.FC<ChatPaneProps> = ({ conversationId }) => {
  const { conversations, getMessagesForConversation, addMessage, markAsRead } = useMessageStore();
  const [newMessage, setNewMessage] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMarkedRead = useRef(false);
  
  const conversation = conversations.find(c => c.id === conversationId);
  const messages = getMessagesForConversation(conversationId);
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  // Mark as read only once when conversation opens
  useEffect(() => {
    if (conversationId && !hasMarkedRead.current) {
      hasMarkedRead.current = true;
      markAsRead(conversationId);
    }
    scrollToBottom();
    
    // Reset the flag when conversation changes
    return () => {
      hasMarkedRead.current = false;
    };
  }, [conversationId, markAsRead, scrollToBottom]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  const handleSend = useCallback(() => {
    if (!newMessage.trim()) return;
    
    addMessage(conversationId, {
      id: Date.now(),
      conversationId,
      direction: 'out',
      text: newMessage,
      timestamp: new Date(),
      isRead: true,
    });
    setNewMessage('');
    scrollToBottom();
  }, [newMessage, conversationId, addMessage, scrollToBottom]);
  
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);
  
  if (!conversation) return null;
  
  const getAppColor = () => {
    const colors: Record<string, string> = {
      whatsapp: '#25D366',
      telegram: '#0088cc',
      signal: '#3b76f0',
      imessage: '#5e5ce0',
    };
    return colors[conversation.app] || '#00c8ff';
  };
  
  return (
    <div className="chat-pane">
      <div className="chat-header" style={{ borderBottomColor: getAppColor() }}>
        <div className="chat-header-info">
          <span className="chat-icon">
            {conversation.app === 'whatsapp' ? '💚' : 
             conversation.app === 'telegram' ? '🔵' : 
             conversation.app === 'signal' ? '🟣' : '🔷'}
          </span>
          <div>
            <div className="chat-contact">{conversation.contact}</div>
            <div className="chat-target">{conversation.targetName} · {conversation.app.toUpperCase()}</div>
          </div>
        </div>
        <div className="chat-actions">
          <button className="btn-icon" title="Export" onClick={() => alert('Exporting conversation...')}>📎</button>
          <button className="btn-icon" title="Search" onClick={() => alert('Search feature coming soon')}>🔍</button>
          <button className="btn-icon" title="More">⋯</button>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">💬</div>
            <div>No messages in this conversation</div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <button className="input-icon" onClick={() => alert('Attach file feature coming soon')}>📎</button>
          <textarea
            className="chat-input"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          <button className="input-icon">😊</button>
          <button className="send-button" onClick={handleSend}>
            Send →
          </button>
        </div>
      </div>
    </div>
  );
};