import { installSsrStoragePolyfill } from "./lib/ssr-storage-polyfill";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

installSsrStoragePolyfill();

export const getRouter = () => {
  installSsrStoragePolyfill();
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
