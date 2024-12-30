import styles from "./PriceGraph.module.css";
import HistoryGraph from "./priceHistory";
import Grid  from "./Grid"
const PriceAnalysis = () => {
    return (
        <div className={styles.container}>
            <Grid />
            <div className={styles.priceHistoryContainer}>
                <h1 className={styles.textPrimary}>Price history</h1>
                <div className={styles.priceHistoryImage}>
                    <HistoryGraph />
                </div>

            </div>
            <div>
                <div className={styles.priceRating}>
                    <h1 className={styles.textPrimary}>Price rating</h1>
                    <button className={styles.buyButton}>Buy soon</button>
                </div>
                <div className={styles.container}>
                    <p className={styles.textPrimary}>
                        We recommend booking soon. The average cost of this flight is $750,
                        but could rise 18% to $885 in two weeks.
                    </p>
                    <p className={styles.textSecondary}>
                        Tripma analyzes thousands of flights, prices, and trends to ensure
                        you get the best deal.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PriceAnalysis;
