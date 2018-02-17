export interface SlackUser {
  name: string;
  id?: string;
  display: string;
}

export function parseUser(user: string): SlackUser | null {
  const regex = /^<?@(?:([a-z0-9]+)(?:\|))?([a-z0-9_.-]+)>?$/i;
  const match = user.match(regex);
  if (!match) {
    return null;
  }
  const id = match[1] || match[2]; // first one if present, else second one
  const name = match[1] && match[2]; // nothing if first one is missing
  return createUser(id, name);
}

export function createUser(id: string, name?: string) {
  return {
    id,
    name,
    display: `<@${id}${name ? '|' + name : ''}>`
  };
}

export function isSameUser(userA: SlackUser, userB: SlackUser): boolean {
  return userA.id === userB.id ||
    userA.name === userB.name ||
    userA.id === userB.name ||
    userA.name === userB.id;
}
