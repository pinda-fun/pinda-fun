import styled, { css } from 'styled-components/macro';

type ButtonProps = {
  primary?: boolean;
};

const FillStyle = css`
  background: var(--dark-purple);
  color: white;
`;

const NoFillStyle = css`
  background: transparent;
  color: var(--dark-purple);
`;

const Button = styled.button`
  ${NoFillStyle}
  border-radius: 0.6rem;
  font-size: 1rem;
  border: 1px solid var(--dark-purple);

  padding: 0.4em 1em;

  transition: 0.2s;

  :hover,
  :active {
    ${FillStyle}
  }

  ${(props: ButtonProps) => props.primary
    && css`
      ${FillStyle}

      :hover,
      :active {
        ${NoFillStyle}
      }
    `};
`;

export default Button;
