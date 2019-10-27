import styled, { css } from 'styled-components';

type ButtonProps = {
  underline?: boolean;
};

const LinkButton = styled.button`
  background: transparent;
  color: var(--dark-purple);
  font-size: 1rem;

  ${(props: ButtonProps) => props.underline
    && css`
      text-decoration: underline;
    `};
`;

export default LinkButton;
