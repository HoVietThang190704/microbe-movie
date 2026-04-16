export interface UserModel {
  id: string;
  email: string;
  username: string;
}

export interface UserUpdateData {
  email?: string;
  username?: string;
}