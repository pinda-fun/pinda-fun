import styled from 'styled-components/macro';
import { smMin } from 'utils/media';

export const ListItemContainer = styled.section`
  width: ${smMin};
  overflow-x: hidden;
  margin: 1rem 0;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.1);
  border-radius: 15px;

  @media (max-width: ${smMin}) {
  width: 75vw;
  }
`;

export const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  width: auto;
  font-size: 1.1rem;
  color: black;
  padding: 18px 18px;
  border-top: 1px solid var(--light-grey);

  :first-child {
  border: none;
  }
`;

// separate component so we can have a more divergent styling in future
export const SelectedListItem = styled.div`
  background: var(--pale-yellow);
  width: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 18px 18px;
  border-top: 1px solid var(--light-grey);
  color: var(--red);

  :first-child {
  border: none;
  }
`;
