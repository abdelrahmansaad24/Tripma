"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./card.module.css";
import { parseISO, format } from "date-fns";


const MAX_TEXT_LENGTH = 170;

const Review = ({ review }) => {
    const [showFullText, setShowFullText] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown Date"; // Fallback for missing date
        try {
            const date = parseISO(dateString); // Parse the date string (e.g., "2024-03")
            return format(date, "MMMM yyyy"); // Formats to "March 2024"
        } catch (error) {
            return "Invalid Date";
        }
    };

    const renderStars = (numberOfStars) => {
        const filledStars = "★".repeat(numberOfStars);
        const emptyStars = "☆".repeat(5 - numberOfStars);
        return filledStars + emptyStars;
    };

    const renderReviewText = (text) => {
        if (text?.length > MAX_TEXT_LENGTH && !showFullText) {
            return (
                <>
                    {text.slice(0, MAX_TEXT_LENGTH)}
                    <span
                        style={{ cursor: "pointer", color: "#605DEC" }}
                        onClick={() => setShowFullText(true)}
                    >
                        ...<a>read more</a>
                    </span>
                </>
            );
        }
        return text;
    };

    return (
        <div className={styles.review}>
            <Image
                className={styles.image}
                width={48}
                height={48}
                src={review.profile}
                alt="user"
            />
            <div className={styles.reviewBody}>
                <div style={{margin:'0', color: "#6E7491" ,padding:'0'}}>
                    <p style={{ fontWeight: "600" }}>{review.name}</p>
                    <p style={{ margin:'0',padding:'0'}}>
                        {review.city}, {review.country} | {formatDate(review.date)}
                    </p>
                </div>
                <p className={styles.p}>{renderStars(review.stars)}</p>
                <p style={{paddingTop:'0',marginTop:'0'}}>{renderReviewText(review.review)}</p>
            </div>
        </div>
    );
};

export default Review;
