# Copilot Instructions for duck-ai Repository

## Overview

This repository contains the snap packaging (and colocated YARF UI tests) for the **duck-ai** snap, published by kenvandine.

## Project Structure

- `assets/` - Static assets like HTML, images, and icons
- `com.github.kenvandine.duck.ai.desktop` - Desktop entry file for the application
- `com.github.kenvandine.duck.ai-autostart.desktop` - Autostart desktop entry
- `constants.js` - Shared constants for the application
- `index.js` - Main Electron application entry point
- `launcher/launcher` - Launcher script for the application
- `package.json` - Node.js package manifest
- `preload.js` - Electron preload script
- `renderer.js` - Electron renderer script
- `snap/` - Snap packaging configuration
- `tests/suite/` - YARF UI test suite

## Key Files

### Snap Packaging

- `snap/snapcraft.yaml` - Main snap packaging definition
- `snap/hooks/configure` - Snap configure hook

### Desktop Entry Files

- `com.github.kenvandine.duck.ai.desktop` - Main desktop entry
- `com.github.kenvandine.duck.ai-autostart.desktop` - Autostart desktop entry

### Application Logic

- `index.js` - Main application logic
- `preload.js` - Electron preload script
- `renderer.js` - Electron renderer script

## Development Guidelines

1. **Electron Application**: The application is built using Electron, with main process logic in `index.js` and renderer process in `renderer.js`
2. **Snap Packaging**: The application is packaged as a snap using snapcraft
3. **UI Components**: HTML files in `assets/html/` define the UI components
4. **Static Assets**: Images and icons are in `assets/img/`
5. **Tests**: UI tests are located in `tests/suite/`

## Code Style

- Follow JavaScript/Node.js best practices
- Use consistent indentation (2 spaces)
- Maintain clear, descriptive variable and function names
- Follow Electron's security guidelines

## Testing

- UI tests are run via YARF on registered remote runners
- No GitHub Actions workflows are used for running tests
- Tests are located in `tests/suite/`

## Maintenance

- Automated maintenance is handled by the `automated-ken` fleet-maintenance system
- Pull requests may be opened to bump versions
- Release validation is handled by automated tests

## Contact

For questions about this repository, please contact @kenvandine or open an issue in the repository.
