import Image from "next/image";
import styles from "./card.module.css";

const Card = ({ image, title, name, price, des, color }) => {
    return (
        <div className={styles.card}>
            <div style={{width:'100%', height:'397px'}} >
                <Image
                    src={image}
                    alt="images"
                    className={styles.image}
                    width={411}
                    height={397}
                />
            </div>
            <div className={styles.body}>
                <div className={styles.head}>
                    <h1 className={styles.title}>
                        {title} <span style={{color:color}}>{name}</span>
                    </h1>
                    {
                        price ? <p className={styles.price}>{price}</p> : null
                    }
                </div>
                <p className={styles.desc}>
                    {des}
                </p>
            </div>
        </div>
    );
};

export default Card;