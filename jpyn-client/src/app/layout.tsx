"use client";
import type { Metadata } from "next";

import { ChainContextProvider } from "@/components/ChainContext";
import Header from "@/components/Header";
import { ChainContext } from "@/components/ChainContext";
import Head from "next/head";
import "../../global.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container } from "@mui/material";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = createTheme({
    typography: {
      fontFamily: ["Roboto"].join(","),
    },
    palette: {
      primary: {
        light: "#e8eaf6",
        main: "#3f51b5",
        dark: "#1a237e",
      },
    },
  });

  return (
    <html>
      <Head>
        <title>JPYN</title>
      </Head>
      <body style={{ background: theme.palette.primary.light }}>
        <ThemeProvider theme={theme}>
          <ChainContextProvider>
            <Header />
            {children}
          </ChainContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
