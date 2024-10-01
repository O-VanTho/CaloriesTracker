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
        className="flex flex-col min-h-screen bg-white mb-[5rem]"
      >
        {children}
        <Navar/>
      </body>
    </html>
  );
}
