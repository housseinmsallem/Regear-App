export function formatDateToMMDDYYYY(date: Date): Date {
  // Create a new Date instance to avoid modifying the original date
  const formattedDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );

  // Return the date as UTC without time zone offsets
  return formattedDate;
}

export function parseDateFromDDMMYYYY(dateString: string): Date {
  // Split the string into day, month, year
  const [day, month, year] = dateString.split('-').map(Number);

  // Create a new Date object using UTC to avoid time zone conversion
  return new Date(Date.UTC(year, month - 1, day));
}
