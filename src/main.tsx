import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import ThemeProvider from "./shared/context/theme.context";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@shared/context/auth.context";
import { GlobalLoadingProvider } from "@shared/context/global-loading.context";
import { AlertProvider } from "@shared/context/alert.context";

export const queryClient = new QueryClient();

const rootRef = document.getElementById("root");
if (rootRef) {
  ReactDOM.createRoot(rootRef).render(
    <React.StrictMode>
      <Router>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <GlobalLoadingProvider>
              <AuthProvider>
                <AlertProvider>
                  <App />
                </AlertProvider>
              </AuthProvider>
            </GlobalLoadingProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ThemeProvider>
      </Router>
    </React.StrictMode>
  );
}
