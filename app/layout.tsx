import type { Metadata } from "next"
import "./globals.css"
import NavBar from "@/components/NavBar" // Import Client Component

export const metadata: Metadata = {
    title: "De-Code",
    description: "What to Hack?",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body className="bg-gray-100 text-gray-900">
        <NavBar /> {/* Use the new Client Component */}
        <main className="container mx-auto p-6">
            {children}
        </main>
        </body>
        </html>
    )
}
