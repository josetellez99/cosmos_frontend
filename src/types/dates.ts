
/**
 * ISO date string in YYYY-MM-DD format (e.g., "2026-03-01")
 */
type ISODateString = string & { readonly __brand: 'ISODateString' };

/**
 * ISO 8601 timestamp string (e.g., "2026-03-19T11:13:16.600Z")
 */
type ISOTimestampString = string & { readonly __brand: 'ISOTimestampString' };

const DATE_PATTERNS = {
  ISODateString: /^\d{4}-\d{2}-\d{2}$/,
  ISOTimestampString: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
} as const;

type DateBrandMap = {
  ISODateString: ISODateString;
  ISOTimestampString: ISOTimestampString;
};

function asDateFormat<K extends keyof DateBrandMap>(
  format: K,
  value: string
): DateBrandMap[K] {
  if (!DATE_PATTERNS[format].test(value)) {
    throw new Error(
      `Invalid date format: expected ${format}, got "${value}"`
    );
  }
  return value as DateBrandMap[K];
}

function asISODateString(value: string): ISODateString {
  return asDateFormat('ISODateString', value);
}

function asISOTimestampString(value: string): ISOTimestampString {
  return asDateFormat('ISOTimestampString', value);
}

export {
  asDateFormat,
  asISODateString,
  asISOTimestampString,
  DATE_PATTERNS,
  type DateBrandMap,
  type ISODateString,
  type ISOTimestampString,
};
