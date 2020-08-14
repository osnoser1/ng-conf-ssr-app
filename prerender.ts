// Load zone.js for the server.
import "zone.js/dist/zone-node";

import { writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
import { ROUTES } from "./static-routes";

const distFolder = join(process.cwd(), "dist/ng-conf-ssr-app/browser");

// Iterate each route path
ROUTES.forEach(languageRoute => {
  // Writes rendered HTML to index.html, replacing the file if it already exists.
  const engine = languageRoute.bundle.ngExpressEngine({
    bootstrap: languageRoute.bundle.AppServerModule,
  });

  languageRoute.childrenRoutes.forEach(route => {
    const fullPath = join(distFolder, languageRoute.view.replace("index", ""), route);

    // Make sure the directory structure is there
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath);
    }

    if (!existsSync(join(fullPath, "index.original.html"))) {
      copyFileSync(join(fullPath, `index.html`), join(fullPath, `index.original.html`));
    }

    engine(
      join(distFolder, `${languageRoute.view}.original.html`),
      {
        req: getRequest(),
        res: {},
        url: route,
        bootstrap: languageRoute.bundle.AppServerModule,
      },
      (err: Error, html: string | undefined) => {
        if (err) {
          console.log(err);
          return;
        }

        writeFileSync(join(fullPath, `${route === "" ? "index" : route}.html`), html);
      },
    );
  });
});


function getRequest() {
  return {
    get(): string | undefined {
      return undefined;
    }
  }
}