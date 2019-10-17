import styled from 'styled-components';

const BigButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 1rem;
  background: var(--purple);
  box-shadow: 0px 6px 0px var(--dark-purple);
  color: white;
  font-size: 1.3rem;

  margin: 6px 0;
  padding: 0.4em 1.4em;
  width: fit-content;

  transition: 0.2s;

  :hover:enabled,
  :active:enabled {
    transform: translateY(6px);
    box-shadow: 0px 0px 0px var(--dark-purple);
  }

  :disabled {
    cursor: not-allowed;
    background: darkgrey;
    box-shadow: 0px 6px 0px grey;
  }
`;

export default BigButton;
