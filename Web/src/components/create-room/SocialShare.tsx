import React from 'react';
import styled from 'styled-components';
import { TelegramButton, WhatsappButton } from '../common/SocialButton';

const defaultPromoText = encodeURIComponent('Join a new game on Pinda!');

const SocialMediaRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  width: 100%;
`;

type SocialShareProps = {
  sharableLink: string;
};

const SocialShare: React.FC<SocialShareProps> = ({ sharableLink }) => {
  const encodedLink = encodeURIComponent(sharableLink);
  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${defaultPromoText}%20${encodedLink}`;
    window.open(url, '_blank');
  };

  const shareTelegram = () => {
    const url = `https://telegram.me/share/url?url=${encodedLink}&text=${defaultPromoText}`;
    window.open(url, '_blank');
  };

  return (
    <SocialMediaRow>
      <WhatsappButton onClick={shareWhatsApp} />
      <TelegramButton onClick={shareTelegram} />
    </SocialMediaRow>
  );
};

export default SocialShare;
