import React from 'react';
import styled from 'styled-components';
import { smMin } from 'utils/media';
import Button from './Button';

type ModalBackgroundProps = {
  isVisible: boolean;
};

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;

  display: ${({ isVisible }: ModalBackgroundProps) => (isVisible ? 'block' : 'none')};
`;

type ModalCardProps = {
  wider?: boolean;
};

const OverlayModalCard = styled.section`
  position: fixed;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background: var(--pale-yellow);
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
  border-radius: 1em;
  padding: 1em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: ${({ wider }: ModalCardProps) => (wider
    ? `calc(${smMin} / 2)`
    : `calc(${smMin} / 3)`)};

  @media (max-width: ${smMin}) {
    width: 75vw;
  }

  p {
    font-size: 1.2rem;
  }
`;

const TitleText = styled.h1`
  font-family: var(--primary-font);
  font-weight: normal;
  font-size: 1.4rem;
`;

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: row wrap;
  justify-content: space-evenly;
`;

/* prevent body scroll code from https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/ */
const preventBodyScroll = () => {
  document.body.style.position = 'fixed';
  document.body.style.top = `-${window.scrollY}px`;
};

const enableBodyScroll = () => {
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.top = '';
  window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
};
/* end prevent body scroll code from https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/ */

type ModalProps = {
  isVisible: boolean;
  title?: string;
  showConfirmation?: boolean;
  showCancel?: boolean;
  confirmationButtonText?: string;
  wider?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const Modal: React.FC<ModalProps> = ({
  children,
  isVisible,
  title,
  showConfirmation,
  showCancel,
  confirmationButtonText,
  wider,
  onConfirm,
  onCancel,
}) => {
  if (isVisible) {
    preventBodyScroll();
  } else {
    enableBodyScroll();
  }

  return (
    <ModalBackground isVisible={isVisible}>
      <OverlayModalCard wider={wider}>
        {title && (
          <TitleText>{title}</TitleText>
        )}
        {children}
        <ButtonRow>
          {showCancel && onCancel
            && (<Button onClick={onCancel}>Cancel</Button>)}
          {showConfirmation && onConfirm
            && (<Button onClick={onConfirm} primary>{confirmationButtonText}</Button>)}
        </ButtonRow>
      </OverlayModalCard>
    </ModalBackground>
  );
};

Modal.defaultProps = {
  showConfirmation: true,
  showCancel: true,
  wider: false,
  confirmationButtonText: 'Confirm',
};

export default Modal;
