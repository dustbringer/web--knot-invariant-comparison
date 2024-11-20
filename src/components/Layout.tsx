import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Knot Invariant Comparison",
  description: "Knot Invariant Comparison",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
