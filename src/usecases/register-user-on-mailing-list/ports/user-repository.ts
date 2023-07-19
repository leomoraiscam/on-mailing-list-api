import { UserData } from "@/dtos/user-data";

export interface UserRepository {
  findAllUsers(): Promise<UserData[]>
  findUserByEmail(email: string): Promise<UserData | null>
  exists(user: UserData): Promise<boolean>
  add(user: UserData): Promise<void>
}