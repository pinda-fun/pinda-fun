import styled from 'styled-components';

export const VerticalContainer = styled.div`
  background: var(--green);
  position: relative;
  overflow: hidden;
  height: ${window.innerHeight}px;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  color: white;
  font-size: 1.4rem;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);
`;

export const HorizontalContainer = styled.span`
  overflow: hidden;
  height: 100%;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;
