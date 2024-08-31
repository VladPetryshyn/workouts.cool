import type { Metadata } from "next";
import "./globals.scss";
import { Header } from "@/components/header";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import NextAuthProvider from "@/components/next-auth-provider";
import NotificationsComponent from "@/components/notifications";
import { Roboto, Roboto_Mono } from "next/font/google";

const roboto = Roboto({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  weight: ["400", "500", "700", "900"],
  variable: "--roboto",
});

const robotoMono = Roboto_Mono({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--roboto-mono",
});

export const metadata: Metadata = {
  title: "Workouts.cool",
  description: "Workout application",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["workouts", "workout timer", "health"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    {
      name: "Vladyslav Petryshyn",
      url: "https://www.linkedin.com/in/vlad-petryshyn/",
    },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  const messages = await getMessages();
  return (
    <html lang={locale} className={`${robotoMono.variable} ${roboto.variable}`}>
      <title>Cool workouts</title>
      <body>
        <NextIntlClientProvider messages={messages}>
          <NextAuthProvider>
            <NotificationsComponent>
              <Header />
              {children}
            </NotificationsComponent>
          </NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
