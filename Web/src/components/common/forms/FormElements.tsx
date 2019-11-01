import styled from 'styled-components';
import BigButton from 'components/common/BigButton';

const SubmitButton = styled(BigButton)`
  padding-left: 2em;
  padding-right: 2em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  & > * {
    margin: 10 0;
  }
`;

export {
  Form,
  SubmitButton,
};
