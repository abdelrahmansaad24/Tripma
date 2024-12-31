import Card from "@/app/components/cards/card";
import Link from "next/link";
import Image from "next/image";
import styles from "./deals.module.css";

async function fetchData(type, length) {
    const url = type === "packages"? `api/package?limit=${length}` : `api/hotels?limit=${length}`;
    try {
        // Fetch from the backend API
        const response = await fetch('https://tripma-eight.vercel.app/' + url, { cache: 'no-store' }); // Ensure data is not cached
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

async function Deals({ length = 3, color = "#605DEC",type = 'packages', title1 = 'Find your next adventure with these'
                         , title2 ='flight deals',title3 }) {
    const packages = await fetchData(type, length)

    return (
        <div className={styles.packageDeals}>
            <div className={styles.head}>
                <p className={styles.headText}>
                    {title1} <span style={{ color: color }}>{title2}</span> {title3}
                </p>
                <Link className={styles.to} href={`/${type}`}>
                    <p className={styles.toText}>All &#8594;</p>
                </Link>
            </div>
            <div className={styles.card}>
                {packages.map((pack, index) => {
                    if (index < 3) {
                        return (
                            <Card
                                key={pack._id}
                                image={pack.image}
                                title={type === 'packages' ? (`${pack.title}, `): (`${pack.title} in `)}
                                name={pack.name}
                                price={pack.price && `$${pack.price}`}
                                des={pack.des}
                                color={color}
                            />
                        );
                    } else if (index === 3) {
                        return (
                            <div key={pack._id} className={styles.cardLong}>
                                <div style={{ width: '100%', height: '100%' }}>
                                    <Image src={pack.image} alt="" className={styles.image} width={1000} height={330} />
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.cardHead}>
                                        <h1 className={styles.cardTitle}>
                                            {type === 'packages' ? (`${pack.title}, `): (`${pack.title} in `)} <span style={{ color: color }}>{pack.name}</span>
                                        </h1>
                                        <p className={styles.price}>${pack.price}</p>
                                    </div>
                                    <p className={styles.desc}>{pack.des}</p>
                                </div>
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
        </div>
    );
}

export default Deals;
