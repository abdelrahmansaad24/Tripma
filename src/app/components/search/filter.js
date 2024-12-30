
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
                <option value="600">$600</option>
                <option value="800">$800</option>
                <option value="1000">$1000</option>
                <option value="1200">$1200</option>
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
                <option value="04:00 AM - 12:00 PM">4 AM - 12 PM</option>
                <option value="12:00 PM - 08:00 PM">12 PM - 8 PM</option>
                <option value="08:00 PM - 04:00 AM">8 PM - 4 AM</option>
            </select>
            <select
                name="airline"
                value={state.airline || ""}
                onChange={handleSelectChange}
                className={styles.button}
            >
                <option value="">Airlines</option>
                <option value="japan">Japan</option>
                <option value="hawaiian">Hawaiian</option>
                <option value="delta">Delta</option>
                <option value="united">United</option>
                <option value="qantas">Qantas</option>
                <option value="france">France</option>
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