import "./globals.css";
import Header from "@/app/components/header/header";
import Footer from "@/app/components/footer/footer";
import CookieConsent from "@/app/cookieNotificatio/notification";
import classes from "@/app/components/header/header.module.css";
import React from "react";
import styles from "@/app/cookieNotificatio/cookieContest.module.css";
import close from "@/assets/cross-close-svgrepo-com.svg";
import Image from "next/image";

export const metadata = {
    title: "Tripma",
    description: "flight reservation system",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">

        <body>
            <Header/>
            <main className={'main'}>
                {children}
            </main>
            <Footer/>
            <CookieConsent/>

        </body>
        </html>
    );
}
