import styles from "./hero.module.css";
import Search from "@/app/components/search/search";


const Hero = () => {
    return (
        <div className={styles.hero}>
            <h1 className={styles.h1}>
                It&#39;s more than <br/> just a trip
            </h1>
            <Search/>
        </div>

    );
};

export default Hero;