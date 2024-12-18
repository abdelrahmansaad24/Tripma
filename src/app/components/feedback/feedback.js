"use client"

import React, {useEffect, useState} from 'react';
import styles from "./feedback.module.css"
import Review from "@/app/components/cards/review";
function Feedback(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchPackages() {
            try {
                // Fetch from the backend API
                const response = await fetch('/api/reviews?limit=3');
                const json = await response.json();
                if (json.success) {
                    setData(json.result);
                } else {
                    console.error("Failed to fetch packages:", json.error);
                }
            } catch (error) {
                console.error("Error fetching packages:", error);
            }
        }

        fetchPackages();
    }, []);
    //  const data = [
    //     {
    //         id: "69692802-b232-50af-ba35-fa27d82e4f6a",
    //         name: "Yifei Chen",
    //         image: "https://github.com/makkenzo/tripma/blob/main/public/images/users/yifei.png?raw=true",
    //         city: "Seoul",
    //         country: "South Korea",
    //         date: new Date(2022, 3, 1),
    //         stars: 5,
    //         review: "This travel service has truly changed my life! I used to be hesitant about traveling alone, but thanks to your platform, I was able to find the perfect trip that completely matched my interests and budget. I visited places I've always dreamed of, met amazing people, and created unforgettable memories. Such an excellent service, from the ease of booking to the incredible experiences. Thank you for making solo travel so enjoyable and hassle-free!",
    //     },
    //     {
    //         id: "e8097948-0969-5295-890a-2ae373f7eda0",
    //         name: "Kaori Yamaguchi",
    //         image: "https://github.com/makkenzo/tripma/blob/main/public/images/users/kaori.png?raw=true",
    //         city: "Honolulu",
    //         country: "Hawaii",
    //         date: new Date(2021, 1, 1),
    //         stars: 4,
    //         review: "Using your travel service has been an absolute game-changer for me! I've always had a passion for exploring new places, but planning trips could sometimes feel overwhelming. With your platform, everything became so much simpler. From browsing through various destinations to finding the best deals, every step was seamless. Thanks to you, I've had the opportunity to embark on unforgettable journeys, immersing myself in different cultures and discovering hidden gems around the world. Your service has truly enriched my travel experiences, and I couldn't be more grateful!",
    //     },
    //     {
    //         id: "1f673e95-0b7b-5b8d-bb3e-940b4a048313",
    //         name: "Anthony Lewis",
    //         image: "https://github.com/makkenzo/tripma/blob/main/public/images/users/anthony.png?raw=true",
    //         city: "Berlin",
    //         country: "Germany",
    //         date: new Date(2023, 6, 1),
    //         stars: 5,
    //         review: "Man, stumbling upon your travel service was like finding a hidden gem! I'm all about exploring new places, but let's be real, planning trips can be a hassle. Your platform made it all a breeze though. I mean, seriously, the interface is smooth as butter and the options are endless. Thanks to you, I've ticked off some epic bucket list adventures, from hiking in the wild to chilling on pristine beaches. Your service has seriously upped my travel game, and I'm loving every minute of it. Keep rocking!",
    //     },
    // ];

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