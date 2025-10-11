import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "./strapi";
import { strapiMe } from "./strapi";

export async function getSession() {
  const jwt = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!jwt) return null;
  const me = await strapiMe(jwt); // { ...user, roleName }
  return { jwt, me, role: me.roleName as "superadmin" | "admin" | "user" };
}
