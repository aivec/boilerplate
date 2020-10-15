export const ERR_FILE_NOT_FOUND = 'FileNotFound';

export class GenericError extends Error {
  public code: string | number;
  constructor(code: string | number, message: string) {
    super(message);
    this.name = 'GenericError';
    this.code = code;
  }
}
