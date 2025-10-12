import chalk from 'chalk';
import terminalLink from 'terminal-link';

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
