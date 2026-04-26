import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Matcher exclut les assets et les routes d’API / fichiers statiques
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
