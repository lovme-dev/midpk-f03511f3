// CJS-safe re-export of react-helmet-async for SSR (Vite ESM interop)
import pkg from "react-helmet-async";

const helmet = pkg as unknown as {
  Helmet: typeof import("react-helmet-async").Helmet;
  HelmetProvider: typeof import("react-helmet-async").HelmetProvider;
};

export const Helmet = helmet.Helmet;
export const HelmetProvider = helmet.HelmetProvider;
