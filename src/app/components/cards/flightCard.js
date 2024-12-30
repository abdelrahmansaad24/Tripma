import styles from "./flightCard.module.css"
import Image from "next/image";
const FlightCard = ({ img, duration, name, time, stop, trip, price, hnl}) => {
    return (
        <div className={styles.card}>
            <div className={styles.gap}>
                <Image width={24} height={24} src={img} alt="hawaiian" className={styles.size}/>
                <div style={{flexDirection:"column"}} className={styles.start}>
                    <h2 className={styles.h2}>{duration}</h2>
                    <p className={styles.p}>{name}</p>
                </div>
            </div>
            <div className={styles.start}>
                <p className={styles.h2}>{time}</p>
            </div>
            <div className={styles.tail}>
                <p className={styles.h2}>{stop}</p>
                <p className={styles.p}>{hnl}</p>
            </div>
            <div className={styles.tail}>
                <p className={styles.h2}>{price}</p>
                <p className={styles.p}>{trip}</p>
            </div>
        </div>

    )
}

export default FlightCard