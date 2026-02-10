import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/infrastructure/graphql/apollo-provider";
import { ReduxProvider } from "@/shared/store/redux-provider";
import { AuthInitializer } from "@/presentation/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eventra - Event Management Platform",
  description: "Discover and manage events with Eventra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ReduxProvider>
          <ApolloWrapper>
            <AuthInitializer>{children}</AuthInitializer>
          </ApolloWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
