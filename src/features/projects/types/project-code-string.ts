/**
 * Project code string in format XX-NN where XX are letters and NN are numbers (e.g., "AB-12")
 */
type ProjectCodeString = string & { readonly __brand: 'ProjectCodeString' };

const PROJECT_CODE_PATTERN = /^[A-Z]{2}-\d{2}$/;

function asProjectCodeString(value: string): ProjectCodeString {
  if (!PROJECT_CODE_PATTERN.test(value)) {
    throw new Error(
      `Invalid project code format: expected XX-NN (e.g., "AB-12"), got "${value}"`
    );
  }
  return value as ProjectCodeString;
}

export {
  asProjectCodeString,
  PROJECT_CODE_PATTERN,
  type ProjectCodeString,
};
