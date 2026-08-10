const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export function validateMonth(month) {
  return typeof month === 'string' && MONTH_PATTERN.test(month);
}

export function getMonthRange(month) {
  if (!validateMonth(month)) {
    throw new Error('Month must use YYYY-MM format.');
  }

  const [year, monthNumber] = month.split('-').map(Number);

  return {
    start: new Date(Date.UTC(year, monthNumber - 1, 1)),
    end: new Date(Date.UTC(year, monthNumber, 1)),
  };
}

export function isPositiveAmount(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

export function isValidDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime());
}
