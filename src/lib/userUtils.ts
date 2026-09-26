export interface UserLike {
  fullName?: string | null;
  name?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  first_name?: string | null;
  lastName?: string | null;
  last_name?: string | null;
  email?: string | null;
}

/**
 * Resolves the display name of the authenticated user based on standard fallback priority:
 * 1. user.fullName / user.name / user.displayName if provided
 * 2. firstName + lastName
 * 3. firstName
 * 4. email prefix as final fallback
 */
export function getUserDisplayName(user?: UserLike | null): string {
  if (!user) return "Member";

  // 1. Explicit name / displayName / fullName property
  const explicitName = (user.fullName || user.displayName || user.name || "").trim();
  if (explicitName && explicitName.toLowerCase() !== "null" && explicitName.toLowerCase() !== "undefined") {
    return explicitName;
  }

  // 2 & 3. Structured firstName and lastName
  const first = (user.firstName || user.first_name || "").trim();
  const last = (user.lastName || user.last_name || "").trim();

  if (first && last && first.toLowerCase() !== "null" && last.toLowerCase() !== "null") {
    return `${first} ${last}`.trim();
  }
  if (first && first.toLowerCase() !== "null" && first.toLowerCase() !== "undefined") {
    return first;
  }
  if (last && last.toLowerCase() !== "null" && last.toLowerCase() !== "undefined") {
    return last;
  }

  // 4. Email prefix as final fallback
  if (user.email && typeof user.email === "string" && user.email.includes("@")) {
    const prefix = user.email.split("@")[0].trim();
    if (prefix) {
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
  }

  return "Member";
}

/**
 * Resolves the first name for personal greetings (e.g. "Good morning, Rahul.")
 */
export function getUserFirstName(user?: UserLike | null): string {
  if (!user) return "Member";

  const first = (user.firstName || user.first_name || "").trim();
  if (first && first.toLowerCase() !== "null" && first.toLowerCase() !== "undefined") {
    return first;
  }

  const fullName = getUserDisplayName(user);
  if (fullName && fullName !== "Member") {
    const firstPart = fullName.split(" ")[0].trim();
    if (firstPart && firstPart.toLowerCase() !== "null" && firstPart.toLowerCase() !== "undefined") {
      return firstPart;
    }
  }

  return "Member";
}
