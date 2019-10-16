import React from 'react';
import styled from 'styled-components';
import QRCode from 'qrcode.react';

const QrContainer = styled.div`
  padding: 25px;
  background: white;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
`;

type QrCodeProps = {
  sharableLink: string;
};

export const QrCode: React.FC<QrCodeProps> = ({
  sharableLink
}) => (
  <QrContainer>
    <QRCode
      value={sharableLink}
      size={128}
      fgColor={'#3a3a3a'}
      bgColor={'white'}
      renderAs={'svg'}
    />
  </QrContainer>
);

export default QrCode;
