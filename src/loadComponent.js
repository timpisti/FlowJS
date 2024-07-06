const componentPromises = new Map(); // Map to track loading state of each component
const componentCache = new Map(); // Map to cache loaded components

// List of essential components to preload
const essentialComponents = [
  'flowjs-darkmodeswitch',
  'flowjs-languageselector',
  // Add any other essential components here
];

// Function to dynamically load a component from a URL using promises
async function loadComponentFromURL(tagName, url) {
  if (customElements.get(tagName)) {
    console.log(`Component ${tagName} is already defined.`);
    return; // Component already defined, no need to load again
  }

  if (!componentPromises.has(tagName)) {
    componentPromises.set(tagName, (async () => {
      try {
        console.log(`Fetching component ${tagName} from URL: ${url}`);
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`Component file not found: ${url}`);
        }
        const module = await import(/* @vite-ignore */ url);
        if (!customElements.get(tagName)) {
          customElements.define(tagName, module.default);
          componentCache.set(tagName, module.default); // Cache the loaded component
          console.log(`Component ${tagName} loaded and defined.`);
        }
      } catch (error) {
        console.error(`Failed to load component ${tagName} from ${url}`, error);
      }
    })());
  }

  return componentPromises.get(tagName);
}

// Function to dynamically load an external custom HTML component
async function loadExternalComponent(tagName, url) {
  console.log(`Loading external component ${tagName} from URL: ${url}`);
  await loadComponentFromURL(tagName, url);
}

// Function to dynamically load a routed component
async function loadRoutedComponent(tagName, file) {
  const url = `${window.FlowJSConfig.baseUrl}${file}`;
  console.log(`Loading routed component ${tagName} from URL: ${url}`);
  await loadComponentFromURL(tagName, url);
}

// Function to preload essential components
async function preloadEssentialComponents() {
  if (!window.FlowJSConfig || !Array.isArray(window.FlowJSConfig.essentialComponents)) {
    console.log('Essential components configuration is missing or invalid. Do you need preload components? Set it.');
    return;
  }

  const essentialComponents = window.FlowJSConfig.essentialComponents;
  for (const component of essentialComponents) {
    await loadExternalComponent(component, `${window.FlowJSConfig.componentFetchUrl}${component}/${component}.js`);
  }
}

// Function to initialize and handle nested components
async function initializeComponents(root) {
  console.log('Initializing components for root:', root);

  // Process only uninitialized elements
  const elements = root.querySelectorAll('*:not([initialized])');

  for (const element of elements) {
    const tagName = element.tagName.toLowerCase();
    if (tagName.startsWith('flowjs-')) {
      element.setAttribute('initialized', 'true');
      if (window.FlowJSConfig.routes) {
        const route = Object.values(window.FlowJSConfig.routes).find(r => `flowjs-${r.component}` === tagName);
        if (route) {
          await loadExternalComponent(tagName, `${window.FlowJSConfig.baseUrl}${route.file}`);
        } else {
          // Load non-routing custom components
          await loadExternalComponent(tagName, `${window.FlowJSConfig.componentFetchUrl}${tagName}/${tagName}.js`);
        }
      }
      // Initialize the component if it contains nested elements
      await initializeComponents(element.shadowRoot || element);
    }
  }

  // Attach click event listeners to links if not already attached
  attachLinkListeners(root);

  // Use MutationObserver to detect dynamically added elements
  const observer = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1 && !node.hasAttribute('initialized')) { // Element node
          const tagName = node.tagName.toLowerCase();
          if (tagName.startsWith('flowjs-')) {
            node.setAttribute('initialized', 'true');
            if (window.FlowJSConfig.routes) {
              const route = Object.values(window.FlowJSConfig.routes).find(r => `flowjs-${r.component}` === tagName);
              if (route) {
                await loadExternalComponent(tagName, `${window.FlowJSConfig.baseUrl}${route.file}`);
              } else {
                // Load non-routing custom components
                await loadExternalComponent(tagName, `${window.FlowJSConfig.componentFetchUrl}${tagName}/${tagName}.js`);
              }
            }
            await initializeComponents(node.shadowRoot || node);
          }
          // Attach click event listeners to newly added links
          attachLinkListeners(node);
        }
      }
    }
  });

  observer.observe(root, { childList: true, subtree: true });
}

// Function to attach click event listeners to links
function attachLinkListeners(root) {
  console.log('Attaching link listeners for root:', root);
  root.querySelectorAll('a[href]:not([data-link-listener])').forEach(anchor => {
    anchor.setAttribute('data-link-listener', 'true');
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      const href = anchor.getAttribute('href');
      const baseUrl = window.FlowJSConfig.baseUrl;
      const newUrl = new URL(href, window.location.origin + baseUrl);
      
      if (window.location.pathname !== newUrl.pathname) {
        console.log('Navigating to:', newUrl.pathname);
        window.history.pushState(null, '', newUrl.pathname);
        loadRoute(); // Call loadRoute from the window object
      }
    });
  });
}

// Function to find the <div id="app"></div> element recursively in the DOM and shadow DOMs
async function findAppDiv(root) {
  console.log('Finding app div in root:', root);
  if (root.getElementById('app')) {
    return root.getElementById('app');
  }

  const elements = root.querySelectorAll('*');
  for (const element of elements) {
    const shadowRoot = element.shadowRoot;
    if (shadowRoot) {
      const appDiv = await findAppDiv(shadowRoot);
      if (appDiv) {
        return appDiv;
      }
    }
  }

  return null;
}

// Function to ensure all custom HTML components are loaded before routing
async function ensureComponentsLoaded() {
  console.log('Ensuring all components are loaded...');
  await preloadEssentialComponents(); // Preload essential components
  await initializeComponents(document.body);

  // Check for the presence of <div id="app"></div> in the main DOM or any shadow DOM
  const appDiv = await findAppDiv(document);

  if (!appDiv) {
    console.error('Error: <div id="app"></div> not found in the DOM or any custom HTML component shadow DOM.');
    return null;
  }

  return appDiv;
}

export { loadRoutedComponent, initializeComponents, ensureComponentsLoaded };
