import React, { memo } from 'react';
import { Message } from '@/types';
import { format } from 'date-fns';
import './MessageBubble.css';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message }) => {
  const isOutgoing = message.direction === 'out';
  
  return (
    <div className={`message-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`}>
      <div className="bubble-content">{message.text}</div>
      <div className="bubble-time">
        {format(message.timestamp, 'HH:mm')}
        {isOutgoing && (
          <span className="message-status">
            {message.isRead ? '✓✓' : '✓'}
          </span>
        )}
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';