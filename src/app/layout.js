import "./globals.css";
import Header from "@/app/components/header/header";
import Footer from "@/app/components/footer/footer";

export const metadata = {
    title: "Tripma",
    description: "flight reservation system",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body >
        <Header />
        <main className={'main'}>
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}
