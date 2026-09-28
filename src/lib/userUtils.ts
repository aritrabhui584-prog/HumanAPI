export interface UserLike {
  fullName?: string | null;
  name?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  first_name?: string | null;
  lastName?: string | null;
  last_name?: string | null;
  email?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  profilePhoto?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  dob?: string | null;
  city?: string | null;
  origin?: string | null;
}

/**
 * Neutral HumanAPI Avatar Placeholder SVG
 * Clean neutral surface (#F6F0E7) with a dark neutral silhouette (#7B6C60).
 * Replaces random Unsplash human photographs for default user states.
 */
export const DEFAULT_USER_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="%237B6C60" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="background-color:%23F6F0E7;"><path d="M19 21v-2a4 4 4 0 0 0-4-4H9a4 4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

/**
 * Checks if a given avatar URL is null, empty, or default placeholder
 */
export function isDefaultAvatar(avatarUrl?: string | null): boolean {
  if (!avatarUrl || !avatarUrl.trim()) return true;
  const trimmed = avatarUrl.trim();
  if (trimmed === DEFAULT_USER_AVATAR) return true;
  // If it's a raw un-uploaded default unsplash photo from early prototypes, consider default
  if (trimmed.includes("photo-1534528741775") || trimmed.includes("photo-1535713875002")) {
    return true;
  }
  return false;
}

/**
 * Resolves the display avatar for the user.
 * Returns uploaded photo if set and non-default, otherwise returns DEFAULT_USER_AVATAR.
 */
export function getUserAvatarUrl(user?: UserLike | null): string {
  if (!user) return DEFAULT_USER_AVATAR;
  const rawAvatar = user.avatar || user.avatarUrl || user.profilePhoto;
  if (rawAvatar && !isDefaultAvatar(rawAvatar)) {
    return rawAvatar;
  }
  return DEFAULT_USER_AVATAR;
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

/**
 * Determines the dynamic time-based greeting prefix according to local device time:
 * 05:00 – 11:59 -> "Good morning"
 * 12:00 – 16:59 -> "Good afternoon"
 * 17:00 – 20:59 -> "Good evening"
 * 21:00 – 04:59 -> "Good evening"
 */
export function getTimeBasedGreetingPrefix(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

/**
 * Formats full time-based greeting for dashboard header:
 * e.g. "Good morning, Rahul."
 */
export function getTimeBasedGreeting(user?: UserLike | null, date: Date = new Date()): string {
  const firstName = getUserFirstName(user);
  const prefix = getTimeBasedGreetingPrefix(date);
  return `${prefix}, ${firstName}.`;
}

export interface MissingFieldItem {
  key: string;
  label: string;
}

export interface ProfileCompletionResult {
  percentage: number;
  completedCount: number;
  totalCount: number;
  isComplete: boolean;
  missingFields: MissingFieldItem[];
}

/**
 * Deterministically calculates profile completion percentage and missing fields.
 * 7 Mandatory Profile Fields:
 * 1. Full Name
 * 2. Email
 * 3. Phone Number
 * 4. Profile Photo
 * 5. Date of Birth
 * 6. City
 * 7. Origin
 */
export function getProfileCompletionDetails(user?: UserLike | null): ProfileCompletionResult {
  if (!user) {
    return {
      percentage: 0,
      completedCount: 0,
      totalCount: 7,
      isComplete: false,
      missingFields: [
        { key: "name", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone Number" },
        { key: "profilePhoto", label: "Profile Photo" },
        { key: "dateOfBirth", label: "Date of Birth" },
        { key: "city", label: "City" },
        { key: "origin", label: "Origin" },
      ],
    };
  }

  const nameVal = (user.name || user.fullName || `${user.firstName || ""} ${user.lastName || ""}`).trim();
  const emailVal = (user.email || "").trim();
  const phoneVal = (user.phone || user.phoneNumber || "").trim();
  const photoVal = user.avatar || user.avatarUrl || user.profilePhoto;
  const dobVal = (user.dateOfBirth || user.dob || "").trim();
  const cityVal = (user.city || "").trim();
  const originVal = (user.origin || "").trim();

  const fields = [
    { key: "name", label: "Full Name", isFilled: nameVal.length > 0 && nameVal !== "Member" },
    { key: "email", label: "Email", isFilled: emailVal.length > 0 && emailVal.includes("@") },
    { key: "phone", label: "Phone Number", isFilled: phoneVal.length > 0 },
    { key: "profilePhoto", label: "Profile Photo", isFilled: !!photoVal && !isDefaultAvatar(photoVal) },
    { key: "dateOfBirth", label: "Date of Birth", isFilled: dobVal.length > 0 },
    { key: "city", label: "City", isFilled: cityVal.length > 0 },
    { key: "origin", label: "Origin", isFilled: originVal.length > 0 },
  ];

  const completedCount = fields.filter(f => f.isFilled).length;
  const totalCount = fields.length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const isComplete = completedCount === totalCount;
  const missingFields = fields.filter(f => !f.isFilled).map(f => ({ key: f.key, label: f.label }));

  return {
    percentage,
    completedCount,
    totalCount,
    isComplete,
    missingFields,
  };
}
