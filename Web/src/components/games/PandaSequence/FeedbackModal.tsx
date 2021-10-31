import React from 'react';
import styled from 'styled-components/macro';
import Modal from 'components/common/Modal';
import { Check, X } from 'react-feather';

type ModalElementProps = {
  isCorrect: boolean;
};

const IconContainer = styled.div`
  height: 8rem;
  width: 8rem;
  border-radius: 100%;
  background-color: ${({ isCorrect }: ModalElementProps) => (isCorrect
    ? 'var(--green)'
    : 'var(--red)')};

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    stroke-width: 0.15rem;
    color: white;
    width: 5rem !important;
    height: 5rem !important;
  }
`;

const GameText = styled.p`
  font-size: 1.7rem !important;
  text-align: center;
  text-shadow: none;
  margin-bottom: 0.5rem;
  color: ${({ isCorrect }: ModalElementProps) => (isCorrect
    ? 'var(--green)'
    : 'var(--red)')};
`;

type FeedbackModalProps = {
  isVisible: boolean;
  isCorrect: boolean;
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isVisible,
  isCorrect,
}) => (
  <Modal
    isVisible={isVisible}
    showConfirmation={false}
  >
    <IconContainer isCorrect={isCorrect}>
      {isCorrect && <Check />}
      {!isCorrect && <X />}
    </IconContainer>
    <GameText isCorrect={isCorrect}>
      {isCorrect && 'Well Done!'}
      {!isCorrect && 'Nah Uh!'}
    </GameText>
  </Modal>
);

export default FeedbackModal;
