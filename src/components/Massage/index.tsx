import * as React from 'react';

import { messageType } from '../../types/messageType';

import './style.scss';

export type props = {
  onHide(id: number): void;
  message: messageType | null;
};

const Message = ({ message, onHide }: props): JSX.Element => {
  let color = 'green';
  let text = '';

  if (message) {
    text = message.text;

    switch (message.type) {
      case 'WARNING':
        color = '#fffa00ad';
        break;
      case 'ERROR':
        color = '#ffc0cbab';
    }
  }

  const handleMessageHide = (): void => {
    onHide(message.id);
  };

  return (
    <div
      className="main-message"
      onClick={handleMessageHide}
      style={
        message
          ? {
              top: 0,
              background: color,
              height: message.text.length < 30 ? 90 : (message.text.length / 30) * 40,
            }
          : {}
      }
    >
      <p>{text || ''}</p>
    </div>
  );
};

Message.displayName = 'Message';

export default Message;
