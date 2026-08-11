import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navigation";
import { cookies } from "next/headers";

export const metadata = {
  title: "PhonoPlay | Phoneme Activity Builder",
  description:
    "A phoneme-based classroom activity builder for Speech Pathology teachers.",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();

  const savedTheme =
    cookieStore.get("phonoplay-theme")?.value || "light";

  const savedLayout =
    cookieStore.get("phonoplay-layout")?.value || "comfortable";

  const validThemes = ["light", "dark", "system"];

  const theme = validThemes.includes(savedTheme)
    ? savedTheme
    : "light";

  const compactLayout =
    savedLayout === "compact";

  return (
    <html lang="en" data-theme={theme}>
      <body
        className={
          compactLayout
            ? "compact-layout"
            : ""
        }
      >
        <Navbar />

        <main className="main-content">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}