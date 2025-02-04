import type { Metadata } from "next";
import "../globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DivRoot, DivContent } from "@/components/styled/Layout";

import MyThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Knot Invariant Comparison",
  description: "Knot Invariant Comparison",
};

// Dealing with typscript and custom themes
// https://stackoverflow.com/questions/59365396/how-to-use-material-ui-custom-theme-in-react-with-typescript

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* https://stackoverflow.com/questions/75595281/react-mui-how-can-i-override-a-primary-color-in-a-theme-palette-for-material-ui */}
        <MyThemeProvider>
          <DivRoot>
            <Navbar />
            <DivContent>{children}</DivContent>
            <Footer />
            {/* <Alerts /> */}
          </DivRoot>
        </MyThemeProvider>
      </body>
    </html>
  );
}
