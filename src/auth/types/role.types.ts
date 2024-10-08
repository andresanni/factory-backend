import { Role } from "../entities/Role";

export type RoleWithoutUsers = Omit <Role, 'users'>;
export type RoleWithoutPermissions = Omit <Role, 'permissions'>;
export type RoleWithoutUsersAndPermissions = Omit <Role, 'users' | 'permissions'>;
