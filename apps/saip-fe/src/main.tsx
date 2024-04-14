import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
// @ts-ignore
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>
);
