import styled, { css } from 'styled-components';

type ButtonProps = {
  primary?: boolean;
};

const Button = styled.button`
  background: transparent;
  border-radius: 0.6rem;
  font-size: 1rem;
  border: 1px solid var(--dark-purple);
  color: var(--dark-purple);

  margin: 0.1rem 1em;
  padding: 0.4em 1em;

  transition: 0.2s;

  :hover,
  :active {
    background: var(--dark-purple);
    color: white;
  }

  ${(props: ButtonProps) =>
    props.primary &&
    css`
      background: var(--dark-purple);
      color: white;

      :hover,
      :active {
        background: transparent;
        color: var(--dark-purple);
      }
    `};
`;

export default Button;
