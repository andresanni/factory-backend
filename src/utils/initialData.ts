import { Permissions } from "../auth/types";
import { PermissionRepository } from "../auth/repositories/PermissionRepository";
import { authDataSource } from "../config/data-source";
import { RoleRepository } from "../auth/repositories/RoleRepository";
import { UserRepository } from "../auth/repositories/UserRepository";
import { Permission } from "../auth/entities/Permission";
import { Role } from "../auth/entities/Role";
import { User } from "../auth/entities/User";
import bcrypt from "bcrypt";

export async function insertInitialData() {
  const permissionsNames: Permissions[] = Object.values(Permissions);
  const permissionRepository = new PermissionRepository(authDataSource);
  const roleRepository = new RoleRepository(authDataSource);
  const userRepository = new UserRepository(authDataSource);

  // Create permissions
  permissionsNames.forEach(async (permissionName) => {
    const permissionObject = new Permission(permissionName);
    await permissionRepository.create(permissionObject);
  });

  // Create role
  const adminRoleObject = new Role("admin");
  await roleRepository.create(adminRoleObject);

  // Add permissions to role
  const allPermissions = await permissionRepository.findAll();
  const adminRole = await roleRepository.findByName("admin");
  if (adminRole) {
    adminRole.permissions = allPermissions;
    await roleRepository.update(adminRole.id!, adminRole);
  }

  // Create user
  const hashedPassword = bcrypt.hashSync("1234", 10);
  const user = new User(
    "user1",
    hashedPassword,
    "user1@admin.com",
    adminRole!,
    "John",
    "Doe"
  );
  await userRepository.create(user);
}
