import Card from "@/app/components/cards/card";
import styles from "./page.module.css";

async function fetchHotels() {
    try {
        // Fetch from the backend API
        const response = await fetch('http://localhost:3000/api/package', { cache: 'no-store' }); // Ensure data is not cached
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
    const packages = await fetchHotels();

    return (
        <div className={styles.page}>
            <div className={styles.head}>
                <p className={styles.p}>
                    Find your next adventure with
                    these <span style={{color:"#605DEC"}}>flight deals</span>
                </p>
            </div>
            <div className={styles.body}>
                {packages && packages.length > 0 ? (
                    packages.map((pack) => (
                        <Card key={pack._id}
                              image={pack.image}
                              title={pack.title}
                              name={pack.name}
                              price={pack.price}
                              des={pack.des}
                              color={"#605DEC"}
                        />
                    )) ):
                    (
                    <p>No packages available at the moment.</p>
                )}
            </div>
        </div>
    );
}
