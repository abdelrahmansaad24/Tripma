import "../globals.css";
import Header from "@/app/components/header/header";
import Footer from "@/app/components/footer/footer";
import CookieConsent from "@/app/(Home)/cookieNotificatio/notification";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth/authSetup";

export const metadata = {
    title: "Tripma",
    description: "flight reservation system",
};

export default async function RootLayout({children}) {
    const session = await auth();

    return (
        <>
            <SessionProvider session={session}>
            <Header/>
            </SessionProvider>
            <main className={'main'}>
                {children}
            </main>
            <Footer/>
            <CookieConsent/>
        </>
    );
}
