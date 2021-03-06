import React from 'react';
import styled from 'styled-components/macro';

const RedText = styled.strong`
  color: var(--red);
`;

const BrandText: React.FC = () => <RedText>Pinda!</RedText>;

export default BrandText;
