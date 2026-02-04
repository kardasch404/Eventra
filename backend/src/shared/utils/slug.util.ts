export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateUniqueSlug(text: string, suffix?: string): string {
  const baseSlug = generateSlug(text);
  return suffix ? `${baseSlug}-${suffix}` : baseSlug;
}
