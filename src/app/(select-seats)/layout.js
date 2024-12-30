import React from "react";
import styles from "./select-seats.module.css"
import Header from "./header"
import Content from "@/app/(select-seats)/copmonents/content";

export const metadata = {
    title: "Tripma",
    description: "flight reservation system",
};

export default function RootLayout({ children }) {
    return (
        <main className={styles.main}>
            <div>
                <Header/>
                {children}
            </div>
        </main>
    );
}
