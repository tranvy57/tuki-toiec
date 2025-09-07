import { IUser } from "./user";

interface IAuth {
  tokten: string;
  authenticated: boolean;
  user: IUser | null;
}
