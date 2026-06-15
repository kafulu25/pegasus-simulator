import React, { useState, useCallback, useMemo } from 'react';
import { useMessageStore } from '@/stores/messageStore';
import { formatDistanceToNow } from 'date-fns';
import './ConversationList.css';

export const ConversationList: React.FC = () => {
  const { conversations, selectedConversationId, selectConversation, markAsRead } = useMessageStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    return conversations.filter(c =>
      c.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);
  
  const getAppIcon = useCallback((app: string) => {
    const icons: Record<string, string> = {
      whatsapp: '💚',
      telegram: '🔵',
      signal: '🟣',
      imessage: '🔷',
      sms: '💬',
    };
    return icons[app] || '📱';
  }, []);
  
  const handleSelect = useCallback((id: number) => {
    selectConversation(id);
    markAsRead(id);
  }, [selectConversation, markAsRead]);
  
  return (
    <div className="conversation-list">
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="conversations">
        {filteredConversations.length === 0 ? (
          <div className="no-conversations">
            No conversations found
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${selectedConversationId === conv.id ? 'active' : ''}`}
              onClick={() => handleSelect(conv.id)}
            >
              <div className="conv-avatar">
                <span className="conv-icon">{getAppIcon(conv.app)}</span>
              </div>
              <div className="conv-info">
                <div className="conv-header">
                  <span className="conv-name">{conv.contact}</span>
                  <span className="conv-time">
                    {formatDistanceToNow(conv.lastMessageTime, { addSuffix: true })}
                  </span>
                </div>
                <div className="conv-preview">{conv.preview}</div>
                <div className="conv-meta">
                  <span className="conv-target">{conv.targetName}</span>
                  <span className="conv-app">{conv.app.toUpperCase()}</span>
                </div>
              </div>
              {conv.unread > 0 && (
                <div className="conv-unread">{conv.unread}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};