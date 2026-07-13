export const normalizeUaPhone = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return '';

  const digits = trimmedValue.replace(/\D/g, '');

  if (trimmedValue.startsWith('+380') && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith('380') && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith('0') && digits.length === 10) {
    return `+38${digits}`;
  }

  return trimmedValue;
};

export const isValidUaPhone = (value: string) => {
  return /^\+380\d{9}$/.test(normalizeUaPhone(value));
};
