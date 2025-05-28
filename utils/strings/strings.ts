export function getInitials(name: string): string {
  const initials = name
    .split(" ")
    .map(word => word[0].toUpperCase())
    .join("");

  return initials.length > 2 ? initials.slice(0, 2) : initials;
}
