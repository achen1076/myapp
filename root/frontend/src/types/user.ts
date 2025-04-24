export interface User {
  id: string;
  username: string;
  email: string;
}

export interface ApiUser {
  id: number;
  username: string;
  email: string;
}

// Convert API user to app user
export const convertApiUser = (apiUser: ApiUser): User => ({
  id: apiUser.id.toString(),
  username: apiUser.username,
  email: apiUser.email,
});
