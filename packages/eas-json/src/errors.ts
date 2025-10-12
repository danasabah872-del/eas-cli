import chalk from 'chalk';

class NamedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = chalk.red(this.constructor.name);
  }
}

export class InvalidEasJsonError extends NamedError {}

/**
 * An error that is thrown when `eas.json` is missing.
 */
export class MissingEasJsonError extends NamedError {}

/**
 * An error that is thrown when a profile is missing.
 */
export class MissingProfileError extends NamedError {}

/**
 * An error that is thrown when a parent profile is missing.
 */
export class MissingParentProfileError extends NamedError {}
