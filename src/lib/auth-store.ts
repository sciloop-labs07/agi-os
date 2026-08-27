export type StoredUser = {
  id: string;
  email: string;
  role: string;
  passwordHash: string;
};

const globalForAuth = globalThis as unknown as { agiUsers?: Map<string, StoredUser> };

const users = globalForAuth.agiUsers ?? new Map<string, StoredUser>();

if (!globalForAuth.agiUsers) globalForAuth.agiUsers = users;

export function findUserByEmail(email: string) {
  return users.get(email.trim().toLowerCase());
}

export function saveUser(user: StoredUser) {
  users.set(user.email.trim().toLowerCase(), user);
  return user;
}
