import React from 'react';
import styles from "./feedback.module.css"
import Review from "@/app/components/cards/review";


async function fetchData() {
    try {
        // Fetch from the backend API
        const response = await fetch('http://localhost:3000/api/reviews?limit=3', { cache: 'no-store' }); // Ensure data is not cached
        const json = await response.json();
        if (json.success) {
            return json.result;
        } else {
            console.error("Failed to fetch reviews:", json.error);
            return [];
        }
    } catch (error) {
        console.error("Error fetching packages:", error);
        return [];
    }
}

async function Feedback(props) {
    const data = await fetchData();

    return (
        <div className={styles.feedback}>
            <h1 className={styles.h1}>
                What <span style={{color: "#605DEC"}}>Tripma</span> users are
                saying
            </h1>
            <div className={styles.review}>
                {data && data.length > 0 ? (
                    data.map((review) => (
                        <Review key={review._id} review={review}/>
                    ))
                ) : null}
            </div>
        </div>
    );
}

export default Feedback;