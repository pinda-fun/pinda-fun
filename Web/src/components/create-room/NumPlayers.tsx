import React from 'react';
import styled, { css } from 'styled-components';
import { Users } from 'react-feather';
import { mdMin } from '../../utils/media';

type ContainerProps = {
  hideOnMedium?: boolean;
  hideOnLarge?: boolean;
};

const NumPlayersContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;

  & > * {
    margin: 0 0.25rem;
  }

  @media (max-width: ${mdMin}) {
    justify-content: center;
  }

  ${(props: ContainerProps) => props.hideOnLarge
    && css`
      display: none;

      @media (max-width: ${mdMin}) {
        display: flex;
      }
    `};

  ${(props: ContainerProps) => props.hideOnMedium
    && css`
      @media (max-width: ${mdMin}) {
        display: none;
      }
    `};
`;

const UsersIcon = styled(Users)`
  stroke-width: 3;
`;

const BigText = styled.span`
  font-size: 2rem;
`;

type NumPlayersProps = {
  numPlayers: number;
  hideOnMedium?: boolean;
  hideOnLarge?: boolean;
};

const NumPlayers: React.FC<NumPlayersProps> = ({
  numPlayers,
  hideOnMedium,
  hideOnLarge,
}) => (
  <NumPlayersContainer hideOnMedium={hideOnMedium} hideOnLarge={hideOnLarge}>
    <UsersIcon />
    <BigText>{numPlayers}</BigText> players
  </NumPlayersContainer>
);

export default NumPlayers;
