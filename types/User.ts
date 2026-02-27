export type UserRole = 'admin' | 'employee' | 'client' | 'newemployee';

export interface User {
  username: string;
  role: UserRole;
}