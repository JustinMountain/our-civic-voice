import { format } from "date-fns";

export const consoleHighlight = "\x1b[34m";
export const consoleError = "\x1b[31m";
export const consoleReset = "\x1b[0m";

export function formatDateForFileName(timeRetrieved: number): string {
  const formattedDate = format(new Date(timeRetrieved), "yyyy-MM-dd-HH-mm");
  return `${formattedDate}-federal-mps.csv`
}

