"use client"
import React, {useState} from 'react';
import { MdOutlineClose } from "react-icons/md";
import styles from "./page.module.css";


const Notification = () => {
    const [close, setClose] = useState(true);
    return (
        close ? (
            <div className={styles.notification}>
                <p className={styles.notificationText}>
                    Your flight has been booked successfully! Your confirmation number is #381029404387
                </p>
                <MdOutlineClose
                    className={styles.closeIcon}
                    onClick={() => setClose(false)}
                />
            </div>
        ) : null
    );
};

export default Notification;