export type ProfileRole = "manager" | "user" | "";

export interface ProfileModel {
  name: string;
  email: string;
  role: ProfileRole;
}

export interface UpdatePasswordModel {
  password: string;
}
