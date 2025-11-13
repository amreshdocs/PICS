/**
 * Formatting utilities for common data transformations
 */

export const formatDate = (dateString: string): string => {
  if (!dateString || dateString === '-') return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export const formatPhoneNumber = (phone: string | number): string => {
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return String(phone);
};

export const formatCurrency = (value: number | string | null): string => {
  const num = Number(value) || 0;
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export default {
  formatDate,
  formatPhoneNumber,
  formatCurrency,
};
