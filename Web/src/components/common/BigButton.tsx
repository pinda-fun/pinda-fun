import styled from 'styled-components/macro';

const BigButton = styled.button`
  border: none;
  border-radius: 1rem;
  background: var(--purple);
  box-shadow: 0 6px 0 var(--dark-purple);
  color: white;
  font-size: 1.3rem;

  margin: 6px 0;
  padding: 0.4em 1.4em;
  width: fit-content;

  transition: 0.2s;

  :disabled {
    cursor: not-allowed;
    background: darkgrey;
    box-shadow: 0 6px 0 grey;
  }

  :hover:enabled,
  :active:enabled {
    transform: translateY(6px);
    box-shadow: 0 0 0 var(--dark-purple);
  }
`;

export default BigButton;
