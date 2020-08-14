/*
 * This file is used for set the configuration for ssr in
 * multiple languages.
 * It must be modified every time a new route is added to which you
 * want to apply prerender.
 * It's used by server.ts and prerender.ts file.
 */

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
export const ROUTES = [
  {
    path: '/es/*',
    view: 'es/index',
    bundle: require('./dist/ng-conf-ssr-app/server/es/main'),
  },
  {
    path: '/*',
    view: 'en/index',
    bundle: require('./dist/ng-conf-ssr-app/server/en/main'),
  },
];
