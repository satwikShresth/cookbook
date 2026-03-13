import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Provider } from "#/components/ui/provider";
import { Toaster } from "#/components/ui/toaster";
import { routeTree } from "./routeTree.gen";
import TanStackQueryProvider, {
	getContext,
} from "./integrations/tanstack-query/root-provider";

const router = createRouter({
	routeTree,
	context: {
		...getContext(),
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootEl = document.getElementById("app")!;
createRoot(rootEl).render(
	<StrictMode>
		<Provider>
			<TanStackQueryProvider>
				<RouterProvider router={router} />
				<Toaster />
			</TanStackQueryProvider>
		</Provider>
	</StrictMode>,
);
