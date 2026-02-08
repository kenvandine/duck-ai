// Shared constants for the application

// Hosts allowed to navigate within the Electron window
// Used by both main process (navigation) and preload (click handling)
const allowedHosts = new Set([
  'duck.ai',
  'duckduckgo.com',
]);

module.exports = {
  allowedHosts,
};
