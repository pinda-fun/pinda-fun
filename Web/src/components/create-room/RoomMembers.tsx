import React from 'react';
import { ListRowProps } from 'react-virtualized';
import styled from 'styled-components';
import { WindowScrollVirtualizedList } from 'components/common/VirtualizedList';
import { smMin } from 'utils/media';

const RoomMembersContainer = styled.div`
  width: ${smMin};
  text-align: center;

  @media (max-width: ${smMin}) {
    width: 75vw;
  }
`;

const MemberRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background: white;
  border-radius: 15px;
  margin: 0.3rem;
  width: 100%;
  font-size: 1.1rem;
`;

const Heading = styled.h1`
  font-family: var(--primary-font);
  font-size: 1.2rem;
  font-weight: normal;
`;

const createMembersRowRenderer = (users: string[]) => ({ key, index, style }: ListRowProps) => (
  <div
    key={key}
    style={{
      ...style,
      display: 'flex',
    }}
  >
    <MemberRow>
      {users[users.length - 1 - index]}
    </MemberRow>
  </div>
);

type RoomMembersProps = {
  users: string[];
};

const RoomMembers: React.FC<RoomMembersProps> = ({ users }) => (
  <RoomMembersContainer>
    <Heading>Connected Players:</Heading>
    <WindowScrollVirtualizedList
      rowCount={users.length}
      rowHeight={60}
      rowRenderer={createMembersRowRenderer(users)}
    />
  </RoomMembersContainer>
);

export default RoomMembers;
