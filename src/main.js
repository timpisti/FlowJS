import { initializeComponents, loadRoutedComponent, ensureComponentsLoaded } from './loadComponent';
import { myService } from './rxService';
import flowUser from './flowUser';  // Import FlowUser
import { HttpClient } from './httpClient';

window.httpClient = new HttpClient();
window.flowUser = flowUser;  // Ensure FlowUser is globally available

// Function to parse the current route based on the pathname
function parseRoute(pathname) {
  const routes = window.FlowJSConfig.routes;
  if (!routes) {
    console.error("Routes configuration is missing.");
    return null;
  }

  console.log('Parsing route for pathname:', pathname);
  for (const path of Object.keys(routes)) {
    const paramNames = [];
    const regexPath = path.replace(/:[^\s/]+/g, (match) => {
      paramNames.push(match.slice(1));
      return '([\\w-]+)';
    });

    try {
      const regex = new RegExp(`^${regexPath}$`);
      const match = pathname.match(regex);
      if (match) {
        const params = match.slice(1).reduce((acc, value, index) => {
          acc[paramNames[index]] = value;
          return acc;
        }, {});
        console.log('Match found:', { path, params });
        return { path, params };
      }
    } catch (e) {
      console.error(`Invalid regular expression: ${regexPath}`, e);
    }
  }
  console.log('No match found for pathname:', pathname);
  return null;
}

// Function to load the route and display the appropriate component
async function loadRoute() {
  console.log('Loading route...');
  const app = await ensureComponentsLoaded();
  if (!app) {
    console.error('App div not found.');
    return;
  }

  // Get the full path relative to the base URL
  const fullPath = window.location.pathname;
  const baseUrl = window.FlowJSConfig.baseUrl || '/';
  const pathname = fullPath.startsWith(baseUrl) ? fullPath.slice(baseUrl.length - 1) : fullPath;

  console.log('Full path:', fullPath);
  console.log('Base URL:', baseUrl);
  console.log('Pathname:', pathname);

  const routeInfo = parseRoute(pathname);

  if (routeInfo) {
    const { path, params } = routeInfo;
    const route = window.FlowJSConfig.routes[path];
    if (route) {
      console.log('Route found:', route);
      await loadRoutedComponent(`flowjs-${route.component}`, route.file);
      const componentTag = `flowjs-${route.component}`;
      app.innerHTML = `<${componentTag}></${componentTag}>`;
      const component = app.querySelector(componentTag);
      component.setAttribute('params', JSON.stringify(params));
      await initializeComponents(app);
    } else {
      console.error('Route not found, loading 404 component.');
      await loadRoutedComponent('flowjs-not-found', 'components/not-found/not-found.js');
      app.innerHTML = `<flowjs-not-found></flowjs-not-found>`;
      await initializeComponents(app);
    }
  } else {
    console.error('Route info not found, loading 404 component.');
    await loadRoutedComponent('flowjs-not-found', 'components/not-found/not-found.js');
    app.innerHTML = `<flowjs-not-found></flowjs-not-found>`;
    await initializeComponents(app);
  }
}

// Attach loadRoute to window to make it globally accessible
window.loadRoute = loadRoute;

// Event listener for history state changes (e.g., back/forward navigation)
window.addEventListener('popstate', loadRoute);

// Initial page load event
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM content loaded, initializing components...');
  // Ensure all custom components are loaded and app div is found
  const appDiv = await ensureComponentsLoaded();

  // If all components are loaded and <div id="app"></div> is found, start routing
  if (appDiv) {
    loadRoute();
    initializeComponents(document.body);

    // Example: Emitting a value to all components after initialization
    setTimeout(() => {
      myService.next({ message: 'Hello from RxJS service!' });
    }, 1000);
  }
});
