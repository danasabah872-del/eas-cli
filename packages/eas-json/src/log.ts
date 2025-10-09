import chalk from 'chalk';
import terminalLink from 'terminal-link';

/**
 * Creates a terminal link.
 * @param url - The URL to link to.
 * @param options - The options for the link.
 * @returns The terminal link.
 */
export function link(
  url: string,
  { text = url, dim = true }: { text?: string; dim?: boolean } = {}
): string {
  let output: string;
  if (terminalLink.isSupported) {
    output = terminalLink(text, url);
  } else {
    output = `${text === url ? '' : text + ': '}${chalk.underline(url)}`;
  }
  return dim ? chalk.dim(output) : output;
}
