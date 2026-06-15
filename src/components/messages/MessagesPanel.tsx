import React, { useState } from 'react';
import { ConversationList } from './ConversationList';
import { ChatPane } from './ChatPane';
import { useMessageStore } from '@/stores/messageStore';
import './MessagesPanel.css';

export const MessagesPanel: React.FC = () => {
  const { selectedConversationId, selectConversation } = useMessageStore();
  
  return (
    <div className="messages-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">💬</span> Intercepted Messages
          </div>
          <div className="panel-subtitle">WhatsApp, Telegram, Signal, iMessage, SMS</div>
        </div>
        <div className="flex gap-8">
          <button className="btn btn-ghost">Export All</button>
          <button className="btn btn-primary">🔍 Advanced Search</button>
        </div>
      </div>
      <div className="two-pane">
        <div className="left-pane">
          <ConversationList />
        </div>
        <div className="right-pane">
          {selectedConversationId ? (
            <ChatPane conversationId={selectedConversationId} />
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">💬</div>
              <div>Select a conversation to view messages</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};