# Copilot Instructions for duck-ai

## Project Overview

This is an unofficial Electron wrapper for DuckDuckGo's Duck.ai AI Companion, providing a native Linux desktop experience. The application is packaged and distributed as a Snap package.

## Technology Stack

- **Runtime**: Node.js with Electron framework
- **Main Language**: JavaScript (Node.js)
- **Packaging**: Snap (snapcraft)
- **Target Platform**: Linux (amd64 and arm64)

## Project Structure

```
.
├── index.js              # Main Electron process
├── preload.js            # Preload script for web content
├── renderer.js           # Renderer process script
├── package.json          # NPM configuration
├── assets/               # Static assets (images, HTML)
│   ├── img/             # Application icons
│   └── html/            # HTML pages (e.g., offline.html)
├── launcher/            # Snap launcher script
├── snap/                # Snap packaging configuration
│   └── snapcraft.yaml   # Snapcraft build configuration
└── .github/
    └── workflows/       # CI/CD workflows
```

## Key Files

- **index.js**: Main Electron application entry point that creates the browser window, manages tray functionality, handles IPC communication, and loads the Duck.ai web app
- **preload.js**: Handles external link clicks and keyboard/mouse zoom shortcuts
- **renderer.js**: Manages network status detection and updates
- **snapcraft.yaml**: Snap package build configuration for multi-architecture support

## Development Workflow

### Setup and Running

```bash
# Install dependencies
npm install

# Run the application
npm start

# Run with system tray
npm run start-tray

# Build for distribution
npm run build
```

### Building Snap Package

The Snap package is built using snapcraft with GitHub Actions for both amd64 and arm64 architectures.

## Code Conventions

### Electron Best Practices

- Use `contextIsolation: true` for security
- Preload scripts bridge between main and renderer processes
- IPC communication for all main-renderer interactions
- External links should open in the default browser, not in the app

### JavaScript Style

- Use `const` for immutable variables, `let` for mutable ones
- Console logging for debugging and monitoring
- Event-driven architecture with IPC messages

### Security Considerations

- Context isolation is enabled
- External links are handled via `shell.openExternal()`
- Window open handlers deny new windows and use external browser
- Node integration is carefully controlled

## Key Features to Maintain

1. **System Tray Support**: Application can run in system tray mode
2. **Autostart**: Users can enable/disable autostart functionality
3. **Zoom Controls**: Ctrl+/- and Ctrl+MouseWheel for zoom
4. **Offline Detection**: Shows offline page when network is unavailable
5. **External Links**: All links open in default browser
6. **Window Management**: Window hides instead of closing
7. **Custom Scrollbars**: Styled scrollbars for better UX
8. **Refresh**: Ctrl+R reloads the Duck.ai web app

## Testing

There is no formal test suite. Manual testing should include:

1. Application launches successfully
2. Duck.ai web app loads correctly
3. Zoom functionality works
4. External links open in browser
5. Network status detection works
6. System tray functionality (when using --tray)
7. Autostart functionality

## Deployment

- Snap packages are automatically built and published to the edge channel on:
  - Push to main branch
  - New release publication
  - Manual workflow dispatch

## Important Notes

- This is an **unofficial** wrapper - not affiliated with DuckDuckGo
- The app loads the official Duck.ai web application (https://duck.ai)
- Snap confinement is strict with specific plugs for required permissions
- GNOME extension is used for desktop integration
- The sidebar menu is hidden via JavaScript injection after page load

## When Making Changes

1. **UI Changes**: The app loads an external web app, so UI changes are limited to window management and injected CSS/JavaScript
2. **IPC Changes**: Ensure proper error handling for all IPC communication
3. **Snap Changes**: Test on both amd64 and arm64 if modifying snap configuration
4. **Dependencies**: Minimize external dependencies; only use what's necessary
5. **Security**: Maintain context isolation and external link handling
6. **License**: GPL-3.0 - ensure any additions comply with this license
