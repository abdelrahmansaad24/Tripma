import React from 'react';
import styles from "@/app/components/flights-explore/flights.module.css";

const Filter = ({state, handleSelectChange}) => {
    return (
        <div className={styles.search}>
            <select
                name="maxPrice"
                value={state.maxPrice || ""}
                onChange={handleSelectChange}
                className={styles.button}
            >
                <option value="">Max price</option>
                <option value="$100-300">$100-300</option>
                <option value="$300-600">$300-600</option>
                <option value="$600-1000">$600-1000</option>
            </select>
            <select
                name="shop"
                value={""}
                className={styles.button}
                onChange={()=> null}
            >
                <option value="">Shops</option>
            </select>
            <select
                name="time"
                value={state.time || ""}
                onChange={handleSelectChange}
                className={styles.button}
            >
                <option value="">Times</option>
                <option value="7 AM - 4 PM">7 AM - 4 PM</option>
                <option value="8 AM - 12 PM">8 AM - 12 PM</option>
                <option value="6 PM - 10 PM">6 PM - 10 PM</option>
            </select>
            <select
                name="airline"
                value={state.airline || ""}
                onChange={handleSelectChange}
                className={styles.button}
            >
                <option value="">Airlines</option>
                <option value="Japan">Japan</option>
                <option value="Hawai">Hawai</option>
                <option value="Dubai">Dubai</option>
            </select>
            <select
                name="flightClass"
                value={state.flightClass || ""}
                onChange={handleSelectChange}
                className={styles.button}
            >
                <option value="">Select Class</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
            </select>
            <select
                name="more"
                value={""}
                className={styles.button}
                onChange={()=> null}
            >
                <option value="">More</option>
            </select>
        </div>
    );
};

export default Filter;