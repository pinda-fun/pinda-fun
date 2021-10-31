import styled from 'styled-components/macro';

type ButtonProps = {
  primary?: boolean;
};

const FillStyle = `
  background: var(--dark-purple);
  color: white;
`;

const NoFillStyle = `
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
    && `
      ${FillStyle}

      :hover,
      :active {
        ${NoFillStyle}
      }
    `};
`;

export default Button;
