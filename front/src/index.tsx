import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { RouterProvider } from "react-router-dom";

// React Query
import { QueryClient, QueryClientProvider } from "react-query";

// Recoil
import { RecoilRoot } from "recoil";

import router from "./routes";
import Loading from "./components/common/Loading";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      useErrorBoundary: true,
    },
    mutations: {
      useErrorBoundary: true,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <RecoilRoot>
    <QueryClientProvider client={client}>
      <RouterProvider router={router} fallbackElement={<Loading />} />
    </QueryClientProvider>
  </RecoilRoot>
);

reportWebVitals();
