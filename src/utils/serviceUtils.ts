import { AuthenticatedUser } from "../auth/types/AuthenticatedUser";
import { Permissions } from "../auth/types";

export function checkAuthorization(
  authenticatedUser: AuthenticatedUser,
  permission: Permissions,
  statusCode: { value: number }
): boolean {
  const authorized: boolean =
    authenticatedUser.permissions.includes(permission);
  if (!authorized) {
    statusCode.value = 403;
    throw new Error(
      `Authorization error\n ${permission} isn't in user permissions. User permissions: ${authenticatedUser.permissions.length ? authenticatedUser.permissions.join(", ") : "empty"}`
    );
  }
  return true;
}
