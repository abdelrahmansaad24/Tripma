import React from "react";
import styles from "./shopcard.module.css";
import Image from "next/image"

const ShopCard = ({image,title, country, price, desc}) => {
    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <Image
                    src={image}
                    alt="Ryokan"
                    className={styles.image}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{`${title} ${country}`}</h1>
                    <div style={{display: "flex", justifyContent: "flex-end", flex:'1',marginRight:'16px' }}>
                        <p className={styles.price}>${price}</p>
                    </div>
                </div>
                <p className={styles.description}>
                    {desc}
                </p>
            </div>
        </div>
    );
};

export default ShopCard;
