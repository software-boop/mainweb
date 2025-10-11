const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

export const AUTH_COOKIE_NAME =
  process.env.AUTH_COOKIE_NAME || "strapi_user_jwt";
export const ROLE_COOKIE_NAME = process.env.ROLE_COOKIE_NAME || "strapi_role";

function normalizeRole(name?: string) {
  return (name || "user").toLowerCase().replace(/[\s_-]+/g, "");
}

function strapiErr(data: any) {
  return (
    data?.error?.message ||
    data?.message ||
    data?.error ||
    "Strapi request failed"
  );
}

/** Users & Permissions login */
export async function strapiLocalLogin(identifier: string, password: string) {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(strapiErr(data));
  return { jwt: data?.jwt as string, user: data?.user };
}

/** Current user (populate role) */
export async function strapiMe(jwt: string) {
  const res = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(strapiErr(data));
  // Ensure role normalization
  const roleName = normalizeRole(data?.role?.name);
  return { ...data, roleName };
}

export { normalizeRole };
