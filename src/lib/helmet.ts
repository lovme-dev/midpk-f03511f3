// Interop-safe re-export of react-helmet-async (CJS in dev SSR, ESM in build).
import * as helmetNs from "react-helmet-async";

type HelmetModule = typeof import("react-helmet-async");

const mod = ((helmetNs as unknown as { default?: HelmetModule }).default ??
  helmetNs) as HelmetModule;

export const Helmet = mod.Helmet;
export const HelmetProvider = mod.HelmetProvider;
