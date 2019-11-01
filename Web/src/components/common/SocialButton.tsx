import React from 'react';
import styled from 'styled-components';
import { ReactComponent as TelegramIconSVG } from '../../svg/social/telegram-icon.svg';
import { ReactComponent as WhatsappIconSVG } from '../../svg/social/whatsapp-icon.svg';

type ButtonProps = {
  onClick: () => void;
};

const TelegramIcon = styled(TelegramIconSVG)`
  background: #0173ab;
  border-radius: 50%;
  box-shadow: 0 3px 0 #0173ab;
`;

const WhatsappIcon = styled(WhatsappIconSVG)`
  background: #17b351;
  border-radius: 50%;
  box-shadow: 0 3px 0 #17b351;
`;

export const WhatsappButton: React.FC<ButtonProps> = (props) => (
  <button {...props} type="button">
    <WhatsappIcon />
  </button>
);

export const TelegramButton: React.FC<ButtonProps> = (props) => (
  <button {...props} type="button">
    <TelegramIcon />
  </button>
);
