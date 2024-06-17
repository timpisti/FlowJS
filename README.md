# Flowwe JS
Flowwe JS is a robust and flexible TypeScript framework designed to programmatically load and manage external nested custom HTML components. It leverages esbuild for efficient building, RxJS for seamless communication between components, and includes built-in support for real-time updates using WebSockets and Server-Sent Events (SSE). FlowJS is designed to handle dynamic routing, lazy loading, and performance optimization, making it an ideal choice for modern web applications.

## Key Features

### Dynamic Component Loading
- Centralized Promise Tracking: Ensures that components are loaded efficiently without redundant requests.
- In-Memory Caching: Uses in-memory caching to minimize network traffic and improve performance. Cache is cleared upon browser refresh.
- Error Handling: Detailed console errors for any issues during component loading and rendering.
### Nested Component Handling
- MutationObserver: Utilizes MutationObserver with a configurable debounce time to manage dynamically added elements efficiently.
- Guidelines: Comprehensive guidelines for managing nested components are included in the documentation.
### Routing
- Dynamic Routing: Supports top-level routes and query parameter handling.
- Route Guarding: Implements basic route guarding based on user authentication states.
### RxJS Integration
- Event Bus Pattern: Employs a basic event bus pattern for inter-component communication.
- Global State Management: Suggests standard methods for defining and managing global state, though not mandatory.
### Real-Time Updates
- Built-In Utilities: Provides utilities for WebSocket and SSE with automatic reconnection logic.
- Unified Configuration: Real-time updates configuration included in the main JSON configuration file.
### Performance Optimization
- Lazy Loading: Enables lazy loading of non-critical components to enhance performance.
- Code Splitting: Recommends splitting custom HTML code into .js, .html, .css, and .config.json files.
- Optimization Tips: Detailed guidelines for optimizing performance, including minimizing DOM updates.
### Security
- Best Practices: Guidelines for handling sensitive data within custom components.
- Configurable Security Headers: Examples provided for adding common security headers if needed.
### Documentation
- Comprehensive Examples: Demonstrates the creation, lifecycle management, real-time updates, and error handling of custom components.
- Best Practices: Covers lifecycle management, error handling, internationalization, and debugging.
- Deployment Guidelines: Specific examples for deploying applications in different environments (e.g., cloud, on-premises).
- Configuration File: Example JSON configuration file with comments explaining each setting.
- Build Tools References: References to popular build tools like Webpack and Rollup.

## Getting Started
FlowJS is designed to be easy to integrate into your existing projects. Here are the steps to get started:

- Installation: Instructions for installing FlowJS and its dependencies.

### Prerequisites
Before you begin, ensure you have the following installed on your development environment:

Node.js: Version 14.x or higher
npm: Version 6.x or higher
TypeScript: Version 4.x or higher (if not already installed, it will be included as a dependency)

### Installation
1: Clone the Repository: Clone the FlowJS repository from GitHub to your local machine.

```bash
git clone https://github.com/yourusername/flowjs.git
cd flowjs
```

2: Install Dependencies: Install the required dependencies using npm.

```bash
npm install
```
- Configuration: Guide to setting up the main configuration file.

FlowJS uses a JSON configuration file to manage settings for various features. Here is an example configuration file (config.json):

```json
{
  "componentFetchURL": "https://your-cdn-path/components",
  "baseURL": "/",
  "routes": {
    "/": "home.js",
    "/articles/:id": "articles.js",
    "*": "not-found.js"
  },
  "realTimeUpdates": {
    "enabled": true,
    "wsEndpoint": "wss://your-websocket-endpoint",
    "sseEndpoint": "https://your-sse-endpoint"
  },
  "performanceMetrics": {
    "enabled": false,
    "loggingEndpoint": "https://your-logging-endpoint"
  },
  "cspEnabled": false,
  "debounceTime": 200
}
```

- Creating Components: Step-by-step guide to creating and dynamically loading custom HTML components.
To create a custom HTML component in FlowJS, follow these steps:

1: Define the Component: Create a new JavaScript file for your component.
```js
// src/components/my-component.js
class MyComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<p>Hello, World!</p>`;
  }

  disconnectedCallback() {
    // Cleanup resources if necessary
  }
}

customElements.define('my-component', MyComponent);
```

- Routing Setup: Instructions for setting up dynamic routing.
FlowJS supports dynamic routing based on URL paths. Configure your routes in the config.json file and create corresponding JavaScript files for each route.
Define Routes: Add routes to the config.json file.
```json
{
  "routes": {
    "/": "home.js",
    "/articles/:id": "articles.js",
    "*": "not-found.js"
  }
}
```

- Real-Time Updates: How to configure and implement real-time updates.
FlowJS includes built-in support for WebSockets and Server-Sent Events (SSE) for real-time updates.
Configure Real-Time Updates: Enable real-time updates in the config.json file.

```json
{
  "realTimeUpdates": {
    "enabled": true,
    "wsEndpoint": "wss://your-websocket-endpoint",
    "sseEndpoint": "https://your-sse-endpoint"
  }
}
```
Implement Real-Time Logic: Use the built-in utilities to handle real-time updates.
```json
// src/realTimeUpdates.js
function setupWebSocket(endpoint) {
  const ws = new WebSocket(endpoint);
  ws.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
  };
  ws.onclose = () => {
    // Reconnect logic
  };
}

function setupSSE(endpoint) {
  const sse = new EventSource(endpoint);
  sse.onmessage = (event) => {
    console.log('SSE message received:', event.data);
  };
}

// Example usage
setupWebSocket(config.realTimeUpdates.wsEndpoint);
setupSSE(config.realTimeUpdates.sseEndpoint);
 ```


- Optimization: Tips and guidelines for optimizing your application’s performance.
- Deployment: Detailed deployment instructions for different environments.

## Contributing
We welcome contributions from the community to help improve FlowJS. Please read our Contributing Guidelines for more information on how to get involved.

License
FlowJS is licensed under the MIT License. See the LICENSE file for more details.
