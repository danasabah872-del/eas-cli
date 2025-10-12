# EAS CLI Monorepo

This repository contains the source code for the EAS CLI and its related packages. EAS CLI is the command-line tool for interacting with Expo Application Services (EAS).

## Overview

This is a Lerna monorepo containing the following packages:

-   **`eas-cli`**: The main command-line interface for EAS. It allows you to build, submit, and manage your Expo projects.
-   **`@expo/eas-json`**: A library for reading, writing, and validating `eas.json`, the configuration file for EAS CLI.
-   **`eas-build-cache-provider`**: A build cache provider plugin for the Expo CLI to speed up local builds by using EAS's remote build cache.

This repository is a comprehensive resource for developers who want to understand how EAS CLI works, contribute to its development, or use its packages in their own projects.

## Getting Started

### Prerequisites

-   Node.js (version 18 or newer)
-   Yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/expo/eas-cli.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd eas-cli
    ```
3.  Install dependencies using Yarn:
    ```bash
    yarn install
    ```

### Building the packages

To build all the packages in the monorepo, run the following command from the root directory:

```bash
yarn build
```

### Running Tests

To run the test suite for all packages, run the following command from the root directory:

```bash
yarn test
```

## Development

To run the local version of EAS CLI, you can use the following command from the root of the repository:

```bash
packages/eas-cli/bin/run <command>
```

For example, to view the help for the `build` command:

```bash
packages/eas-cli/bin/run build --help
```

### Debugging

To debug the CLI, you can use the following command:

```bash
node --inspect-brk packages/eas-cli/bin/run <command>
```

Then, open `chrome://inspect` in your browser and click on the "Open dedicated DevTools for Node" link.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
