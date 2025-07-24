import "./index.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./pages/dashboard/account/themeprovider/Themeprovider";
import { PersistGate } from "redux-persist/integration/react";
import { MediaProvider } from "./context/MediaContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <MediaProvider>
            <RouterProvider router={router} />
          </MediaProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>,
);
