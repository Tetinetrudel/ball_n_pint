
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { JetBrains_Mono, DM_Sans, Public_Sans, Lora, Roboto } from "next/font/google";
import { cn } from "@/lib/utils";

const lora = Lora({subsets:['latin'],variable:'--font-serif'});

const dmSansHeading = DM_Sans({subsets:['latin'],variable:'--font-heading'});

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

export const metadata = {
  title: "Ball'N'Pint",
  description: "Description à venir",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn( jetbrainsMono.variable, roboto.variable, "font-serif", lora.variable, dmSansHeading.variable)}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
