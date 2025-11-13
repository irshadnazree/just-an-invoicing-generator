import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import Navbar from "@/components/shared/navbar";
import { ThemeProvider } from "@/lib/provider/theme-provider";
import { getThemeServerFn } from "@/lib/theme";

import "@fontsource-variable/public-sans";
import "@fontsource-variable/jetbrains-mono";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: ({ loaderData }) => {
    const theme = loaderData as "light" | "dark" | undefined;
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "theme-color",
          content: theme === "dark" ? "#0a0a0a" : "#ffffff",
        },
        {
          title: "Just an Invoicing Generator",
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
    };
  },
  loader: () => getThemeServerFn(),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = Route.useLoaderData();
  return (
    <html data-theme={theme} lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col items-center">
        <ThemeProvider theme={theme}>
          <Navbar />
          <main className="mx-auto my-10 w-full max-w-400 grow px-25">
            {children}
          </main>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
