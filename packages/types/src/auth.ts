import { IBackendRes, Role } from "./backend";

export interface IReqLoginDTO {
  username: string;
  password: string;
}

export interface IResLoginDTO {
  access_token: string;
  user: IUserLogin;
}

export interface IUserLogin {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: Role;
}

export interface IUserGetAccount {
  user: IUserLogin;
}
