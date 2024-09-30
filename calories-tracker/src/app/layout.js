import Navar from "@/components/Navar/Navar"
import "./globals.css";

export const metadata = {
  title: "Calories Tracker",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="flex flex-col min-h-full bg-white mb-24"
      >
        {children}
        <Navar/>
      </body>
    </html>
  );
}
