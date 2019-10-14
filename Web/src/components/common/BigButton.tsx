import styled, { css } from 'styled-components';

const BigButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 1rem;
  background: var(--purple);
  box-shadow: 0px 6px 0px var(--dark-purple);
  color: white;
  font-size: 1.3rem;

  margin: 6px;
  padding: 0.4em 1.4em;

  transition: 0.2s;

  :hover,
  :active {
    transform: translateY(6px);
    box-shadow: 0px 0px 0px var(--dark-purple);
  }
`;

export default BigButton;
