'use client';

import React, { useEffect, useState } from 'react';
import close from "@/assets/cross-close-svgrepo-com.svg";
import Image from "next/image";
import styles from "./cookieContest.module.css"

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the user has already accepted cookies
        const consent = localStorage.getItem('cookieConsent');

        // Show notification only if no consent is found (first visit)
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        // Store a flag in localStorage to mark that the user has accepted cookies
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null; // Don't render if consent has already been given

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <p className={styles.p}>By using our site, you agree to eat our cookies.</p>
                <Image
                    className={styles.close}
                    style={{cursor: 'pointer'}}
                    src={close}
                    alt="X"
                    onClick={()=> setIsVisible(false)}
                />
            </div>
            <div className={styles.buttons}>
                <button className={styles.accept} onClick={handleAccept}>
                    Accept cookies
                </button>
                <button className={styles.setting}>Go to settings</button>
            </div>

        </div>
    );
}
//
// const styles = {
//     container: {
//         position: 'fixed',
//         bottom: '20px',
//         left: '20px',
//         backgroundColor: '#f3f4f6',
//         padding: '15px',
//         borderRadius: '8px',
//         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//         zIndex: 1000,
//
//     },
//     acceptButton: {
//         backgroundColor: '#6366f1',
//         color: '#fff',
//         padding: '10px 15px',
//         border: 'none',
//         borderRadius: '4px',
//         cursor: 'pointer',
//         marginTop: '10px',
//     },
// };
