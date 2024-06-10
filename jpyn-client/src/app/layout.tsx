import type { Metadata } from "next";

import { ChainContextProvider } from "@/components/ChainContext";
import Header from "@/components/Header";
import { ChainContext } from "@/components/ChainContext";
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <Head>
        <title>JPYN</title>
      </Head>
      <body>
        <ChainContextProvider>
          <Header />
          {children}
        </ChainContextProvider>
      </body>
    </html>
  );
}
