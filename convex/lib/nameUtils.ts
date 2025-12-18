// convex/lib/nameUtils.ts

/**
 * Format full name from individual components
 * 
 * @param firstName - Required first name
 * @param middleName - Optional middle name
 * @param lastName - Required last name  
 * @param nameExtension - Optional extension (Jr., Sr., III, etc.)
 * @returns Formatted full name
 * 
 * Examples:
 * - formatFullName("Juan", undefined, "Dela Cruz", undefined) => "Juan Dela Cruz"
 * - formatFullName("Juan", "Santos", "Dela Cruz", undefined) => "Juan Santos Dela Cruz"
 * - formatFullName("Juan", "Santos", "Dela Cruz", "Jr.") => "Juan Santos Dela Cruz Jr."
 */
export function formatFullName(
  firstName: string,
  middleName?: string,
  lastName?: string,
  nameExtension?: string
): string {
  const parts: string[] = [firstName];
  
  if (middleName) parts.push(middleName);
  if (lastName) parts.push(lastName);
  if (nameExtension) parts.push(nameExtension);
  
  return parts.join(" ");
}

/**
 * Format last name first (for alphabetical sorting)
 * 
 * @param firstName - Required first name
 * @param middleName - Optional middle name
 * @param lastName - Required last name
 * @param nameExtension - Optional extension
 * @returns Formatted name with last name first
 * 
 * Examples:
 * - formatLastNameFirst("Juan", undefined, "Dela Cruz", undefined) => "Dela Cruz, Juan"
 * - formatLastNameFirst("Juan", "Santos", "Dela Cruz", "Jr.") => "Dela Cruz, Juan Santos Jr."
 */
export function formatLastNameFirst(
  firstName: string,
  middleName?: string,
  lastName?: string,
  nameExtension?: string
): string {
  if (!lastName) {
    return formatFullName(firstName, middleName, lastName, nameExtension);
  }
  
  const firstParts: string[] = [firstName];
  if (middleName) firstParts.push(middleName);
  if (nameExtension) firstParts.push(nameExtension);
  
  return `${lastName}, ${firstParts.join(" ")}`;
}

/**
 * Get initials from name components
 * 
 * @param firstName - Required first name
 * @param middleName - Optional middle name
 * @param lastName - Required last name
 * @returns Initials (2 or 3 letters)
 * 
 * Examples:
 * - getInitials("Juan", undefined, "Dela Cruz") => "JD"
 * - getInitials("Juan", "Santos", "Dela Cruz") => "JSD"
 */
export function getInitials(
  firstName: string,
  middleName?: string,
  lastName?: string
): string {
  const initials: string[] = [firstName[0]?.toUpperCase() || ""];
  
  if (middleName) {
    initials.push(middleName[0]?.toUpperCase() || "");
  }
  
  if (lastName) {
    initials.push(lastName[0]?.toUpperCase() || "");
  }
  
  return initials.join("");
}

/**
 * Split a full name string into components (BEST EFFORT)
 * This is for migrating old data - not 100% accurate
 * 
 * @param fullName - Full name string to split
 * @returns Object with firstName, middleName, lastName, nameExtension
 * 
 * Examples:
 * - splitFullName("Juan Dela Cruz") => { firstName: "Juan", lastName: "Dela Cruz" }
 * - splitFullName("Juan Santos Dela Cruz") => { firstName: "Juan", middleName: "Santos", lastName: "Dela Cruz" }
 * - splitFullName("Juan Santos Dela Cruz Jr.") => { firstName: "Juan", middleName: "Santos", lastName: "Dela Cruz", nameExtension: "Jr." }
 */
export function splitFullName(fullName: string): {
  firstName: string;
  middleName?: string;
  lastName?: string;
  nameExtension?: string;
} {
  if (!fullName || fullName.trim() === "") {
    return { firstName: "Unknown", lastName: "" };
  }
  
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);
  
  if (parts.length === 0) {
    return { firstName: "Unknown", lastName: "" };
  }
  
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }
  
  // Check for name extensions (Jr., Sr., III, IV, etc.)
  const lastPart = parts[parts.length - 1];
  const extensions = ["Jr.", "Sr.", "Jr", "Sr", "III", "IV", "V", "VI", "II"];
  let nameExtension: string | undefined;
  let nameParts = parts;
  
  if (extensions.some(ext => lastPart.toUpperCase() === ext.toUpperCase())) {
    nameExtension = lastPart;
    nameParts = parts.slice(0, -1);
  }
  
  if (nameParts.length === 2) {
    // First Last
    return {
      firstName: nameParts[0],
      lastName: nameParts[1],
      nameExtension,
    };
  }
  
  if (nameParts.length === 3) {
    // First Middle Last
    return {
      firstName: nameParts[0],
      middleName: nameParts[1],
      lastName: nameParts[2],
      nameExtension,
    };
  }
  
  // 4+ parts: First [Middle...] Last
  // Assume first part is first name, last part is last name, everything else is middle
  return {
    firstName: nameParts[0],
    middleName: nameParts.slice(1, -1).join(" "),
    lastName: nameParts[nameParts.length - 1],
    nameExtension,
  };
}

/**
 * Validate name components
 * 
 * @param firstName - First name to validate
 * @param lastName - Last name to validate
 * @returns Validation result with errors if any
 */
export function validateNameComponents(
  firstName?: string,
  lastName?: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!firstName || firstName.trim() === "") {
    errors.push("First name is required");
  } else if (firstName.trim().length < 2) {
    errors.push("First name must be at least 2 characters");
  } else if (!/^[a-zA-Z\s\-'.]+$/.test(firstName)) {
    errors.push("First name contains invalid characters");
  }
  
  if (!lastName || lastName.trim() === "") {
    errors.push("Last name is required");
  } else if (lastName.trim().length < 2) {
    errors.push("Last name must be at least 2 characters");
  } else if (!/^[a-zA-Z\s\-'.]+$/.test(lastName)) {
    errors.push("Last name contains invalid characters");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Ensure user object has name field for backward compatibility
 * If name is missing but firstName/lastName exist, generate it
 * 
 * @param user - User object from database
 * @returns User object with guaranteed name field
 */
export function ensureUserName<T extends { 
  name?: string; 
  firstName?: string; 
  middleName?: string;
  lastName?: string;
  nameExtension?: string;
}>(user: T): T & { name: string } {
  if (user.name) {
    return user as T & { name: string };
  }
  
  if (user.firstName) {
    return {
      ...user,
      name: formatFullName(
        user.firstName,
        user.middleName,
        user.lastName,
        user.nameExtension
      ),
    };
  }
  
  return {
    ...user,
    name: "Unknown User",
  };
}