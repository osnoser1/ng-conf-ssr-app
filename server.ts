import 'zone.js/dist/zone-node';

import * as express from 'express';
import { join } from 'path';

import { ROUTES } from './static-routes';
import { APP_BASE_HREF } from '@angular/common';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/ng-conf-ssr-app/browser');

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', (filePath, options: any, callback) => {
    options.engine(filePath, { req: options.req, res: options.res }, callback);
  });

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, { maxAge: '1y' }));
  server.get('*.*', express.static(join(distFolder, 'en'), { maxAge: '1y' }));

  
  // All regular routes use the Universal engine
  ROUTES.forEach(route => {
    server.get(route.path, (req, res) => {
      res.render(route.view, {
        req,
        res,
        engine: route.bundle.ngExpressEngine({
          bootstrap: route.bundle.AppServerModule,
          providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
        }),
      });
    });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
run();
