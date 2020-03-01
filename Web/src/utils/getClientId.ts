import { v4 as uuidv4 } from 'uuid';

const CLIENT_ID_LOCAL_STORAGE_KEY = 'client_id';

export default function getClientId(): string {
  const maybeClientId = localStorage.getItem(CLIENT_ID_LOCAL_STORAGE_KEY);
  if (maybeClientId == null) {
    const clientId = uuidv4();
    localStorage.setItem(CLIENT_ID_LOCAL_STORAGE_KEY, clientId);
    return clientId;
  }
  return maybeClientId;
}
