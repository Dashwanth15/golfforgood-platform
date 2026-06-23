import { format, parseISO, formatDistanceToNow } from 'date-fns';

export const formatCurrency = (amount: number, currency = 'GBP'): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
};

export const formatDateShort = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy');
  } catch {
    return dateStr;
  }
};

export const formatDrawMonth = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'MMMM yyyy');
  } catch {
    return dateStr;
  }
};

export const formatRelativeTime = (dateStr: string): string => {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getMatchLevelLabel = (level: string): string => {
  const labels: Record<string, string> = {
    five_match: '5 Match',
    four_match: '4 Match',
    three_match: '3 Match',
  };
  return labels[level] ?? level;
};

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    active: 'badge-success',
    expired: 'badge-danger',
    cancelled: 'badge-warning',
    pending: 'badge-warning',
    approved: 'badge-success',
    rejected: 'badge-danger',
    published: 'badge-success',
    draft: 'badge-blue',
    simulated: 'badge-blue',
    paid: 'badge-success',
  };
  return map[status] ?? 'badge-blue';
};
