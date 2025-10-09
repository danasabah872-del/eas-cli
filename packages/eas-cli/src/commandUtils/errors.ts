/**
 * A custom error class for eas-cli commands.
 */
export class EasCommandError extends Error {
  // constructor is not useless, since the constructor for Error allows for optional `message`
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  /**
   * Creates a new instance of EasCommandError.
   * @param message - The error message.
   */
  constructor(message: string) {
    super(message);
  }
}
