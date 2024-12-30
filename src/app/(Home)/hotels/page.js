import Card from "@/app/components/cards/card";
import styles from "./page.module.css";

async function fetchHotels() {
    try {
        // Fetch from the backend API
        const response = await fetch('http://localhost:3000/api/hotels', { cache: 'no-store' }); // Ensure data is not cached
        const json = await response.json();
        if (json.success) {
            return json.result;
        } else {
            console.error("Failed to fetch packages:", json.error);
            return [];
        }
    } catch (error) {
        console.error("Error fetching packages:", error);
        return [];
    }
}

export default async function Page() {
    const hotels = await fetchHotels();

    return (
        <div className={styles.page}>
            <div className={styles.head}>
                <p className={styles.p}>
                    Find your next adventure with
                    these <span style={{ color: "#3bcab0" }}>flight deals</span>
                </p>
            </div>
            <div className={styles.body}>
                {hotels && hotels.length > 0 ? (
                    hotels.map((pack) => (
                        <Card
                            key={pack._id}
                            image={pack.image}
                            title={pack.title}
                            name={pack.name}
                            des={pack.des}
                            color={"#3bcab0"}
                        />
                    ))
                ) : (
                    <p>No hotels available at the moment.</p>
                )}
            </div>
        </div>
    );
}
