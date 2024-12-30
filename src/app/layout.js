// import "./globals.css";
import React from "react";
import {Toaster} from "react-hot-toast";

export const metadata = {
    title: "Tripma",
    description: "flight reservation system",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">

        <body>
        <main >
            <Toaster position="bottom-center" />
            {children}
        </main>
        </body>
        </html>
    );
}
