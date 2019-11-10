import React from 'react';
import styled from 'styled-components/macro';

const NUMPAD_KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '-', '0'];

const KeypadWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const KeypadContainer = styled.div`
  display: flex;
  flex-flow: row wrap;

  touch-action: none;
`;

const KeyButton = styled.button`
  background: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  padding: 0.6rem 2rem;
  margin: 0.3rem;
  flex: 0 0 calc((100% / 3) - 0.6rem);

  color: var(--dark-purple);
  font-size: 2rem;
`;

type NumKeypadProps = {
  onClickKey: (key: string) => void;
  disabled?: boolean;
};

const NumKeypad: React.FC<NumKeypadProps> = ({ onClickKey, disabled = false }) => {
  const actionHandler = (e: React.SyntheticEvent, val: string) => {
    e.preventDefault();
    onClickKey(val);
  };
  return (
    <KeypadWrapper>
      <KeypadContainer>
        {
          // See: https://github.com/facebook/react/issues/9809#issuecomment-395607117
          NUMPAD_KEYS.map((val) => (
            <KeyButton
              key={val}
              onMouseDown={(e) => actionHandler(e, val)}
              onTouchStart={(e) => actionHandler(e, val)}
              onTouchEnd={(e) => e.preventDefault()}
              disabled={disabled}
            >
              {val}
            </KeyButton>
          ))
        }
      </KeypadContainer>
    </KeypadWrapper>
  );
};

export default NumKeypad;
