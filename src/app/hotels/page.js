"use client"

import React , {useEffect, useState} from "react";
import Card from "@/app/components/cards/card";
import styles from "./page.module.css";

function Page(props) {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        async function fetchHotels() {
            try {
                // Fetch from the backend API
                const response = await fetch('/api/hotels');
                const json = await response.json();
                if (json.success) {
                    setHotels(json.result);
                } else {
                    console.error("Failed to fetch packages:", json.error);
                }
            } catch (error) {
                console.error("Error fetching packages:", error);
            }
        }

        fetchHotels();
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.head}>
                <p className={styles.p}>
                    Find your next adventure with
                    these <span style={{color:"#3bcab0"}}>flight deals</span>
                </p>
            </div>
            <div className={styles.body}>
                {hotels && hotels.length > 0 ? (
                    hotels.map((pack) => (
                        <Card key={pack._id}
                              image={pack.image}
                              title={pack.title}
                              name={pack.name}
                              des={pack.des}
                              color={"#3bcab0"}
                        />
                    ))
                ) : null}
                {/*<Card*/}
                {/*    image={shanghai}*/}
                {/*    title="The Bund, "*/}
                {/*    name="Shanghai"*/}
                {/*    price="$598"*/}
                {/*    des=" China’s most international city"*/}
                {/*/>*/}
                {/*<Card*/}
                {/*    image={sydney}*/}
                {/*    title="Sydney Opera House, "*/}
                {/*    name="Sydney"*/}
                {/*    price="$981"*/}
                {/*    des=" Take a stroll along the famous harbor"*/}
                {/*/>*/}
                {/*<Card*/}
                {/*    image={temple}*/}
                {/*    title="Kōdaiji Temple,"*/}
                {/*    name="Kyoto"*/}
                {/*    price="$633"*/}
                {/*    des=" Step back in time in the Gion district"*/}
                {/*/>*/}
                {/*<Card*/}
                {/*    image={sunrise}*/}
                {/*    title="Nairobi, "*/}
                {/*    name="Kenya"*/}
                {/*    price="$1,248"*/}
                {/*    des="Dubbed the Safari Capital of the World"*/}
                {/*/>*/}
                {/*<Card*/}
                {/*    image={seoul}*/}
                {/*    title="Seoul, "*/}
                {/*    name="South Korea"*/}
                {/*    price="$589"*/}
                {/*    des="This modern city is a traveler’s dream"*/}
                {/*/>*/}
            </div>
        </div>
    );
}

export default Page;