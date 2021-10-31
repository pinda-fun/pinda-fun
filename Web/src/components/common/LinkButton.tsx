import styled from 'styled-components/macro';

type ButtonProps = {
  underline?: boolean;
};

const LinkButton = styled.button`
  background: transparent;
  color: var(--dark-purple);
  font-size: 1rem;

  ${(props: ButtonProps) => props.underline && 'text-decoration: underline;'};
`;

export default LinkButton;
