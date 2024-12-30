import React from "react";
import Link from "next/link";
import ShopCard from "@/app/components/cards/shopCard"; // Import the ShopCard component
import teamLab from "@/assets/images/teamLab.png";
import Bessho from "@/assets/images/Bessho.png"
import HotelFlag from "@/assets/images/HotelFlag.png"
import Ryoka from "@/assets/images/Ryoka.png"
import fiveHole from "@/assets/images/fiveHole.png"
import kimono from "@/assets/images/kimono.png"
import styles from "./shop.module.css"

const ConfirmShop = () => {
    const hotels = [
        {
            image: Ryoka,
            title: "Ryokan",
            country: "Japan",
            price: 439,
            desc: "Enjoy views of the garden from your room",
        },
        {
            image: HotelFlag,
            title: "HOTEL THE FLAG",
            country: "大阪市",
            price: 139,
            desc: "Modern hotel in the heart of Osaka",
        },
        {
            image: Bessho,
            title: "Bessho SASA",
            country: "",
            price: 529,
            desc: "Japanese ryokan with private onsen bath",
        },
        {
            image: fiveHole,
            title: "9 Hours Shinjuku",
            country: "",
            price: 59,
            desc: "A convenient capsule hotel at Shinjuku station",
        },
    ];

    const experiences = [
        {
            image: kimono,
            title: "Nihon Kimono",
            country: "",
            price: 89,
            desc: "Wear the national dress of Japan around the city",
        },
        {
            image: teamLab,
            title: "teamLab Borderless",
            country: "",
            price: 39,
            desc: "A modern sensory experience of light and sound",
        },
    ];

    return (
        <div className={styles.container}>
            {/* Hotels Section */}
            <div className={styles.header}>
                <h1>
                    Shop <span style={{color:'#605DEC', marginLeft:'4px'}}>{' hotels'}</span>
                </h1>
                <p>
                    Tripma partners with thousands of hotels to get you the best deal.
                    Save up to 30% when you add a hotel to your trip.
                </p>
            </div>
            <div className={styles.content}>
                {hotels.map((hotel, index) => (
                    <ShopCard
                        key={index}
                        image={hotel.image}
                        title={hotel.title}
                        country={hotel.country}
                        price={hotel.price}
                        desc={hotel.desc}
                    />
                ))}
                <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                    <Link href="/hotels" className={styles.btn}>
                        <p>Shop all hotels</p>
                    </Link>
                </div>

            </div>

            <div className={styles.header}>
                <h1 >
                    Find unique<span style={{color:"#605DEC]"}}> experiences</span>
                </h1>
                <p>
                    Find events and authentic cultural experiences available exclusively to Tripma users.
                </p>
            </div>
            <div className={styles.content}>
                {experiences.map((experience, index) => (
                    <ShopCard
                        key={index}
                        image={experience.image}
                        title={experience.title}
                        country={experience.country}
                        price={experience.price}
                        desc={experience.desc}
                    />
                ))}
                <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                    <Link href="/packages" className={styles.showAllBtn}>
                        <p>
                            View all experiences
                        </p>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default ConfirmShop;
