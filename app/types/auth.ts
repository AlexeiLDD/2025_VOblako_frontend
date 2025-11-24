export type AuthUser = {
  id: number;
  email: string;
};

export type AuthResponse = {
  user?: AuthUser;
  is_auth: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  password_repeat: string;
};

export type EmptyResponse = null;

export type ErrorStatus =
  | "Server error"
  | "User already authorized"
  | "User not authorized"
  | "Password must have length between 8 and 32 symbols"
  | "Passwords do not match"
  | "Wrong credentials"
  | "User with this email already exists"
  | "Wrong JSON format";

export type ErrorResponse = {
  status: ErrorStatus;
};
