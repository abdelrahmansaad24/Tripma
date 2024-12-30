import React from 'react';
import styles from './flightPrice.module.css';
import Image from "next/image"
import Link from "next/link"
import separator from "@/assets/sperator-noOR.svg"
import {useRouter} from 'next/navigation';
// import {cookies} from 'next/headers';
const flightCard = (flight) =>{
    console.log(flight)
    return (
        <div className={styles.flightSegment}>
            <div className={styles.flightInfo}>
                <Image
                    width={40}
                    height={40}
                    src={flight.logo}
                    alt={flight.name}
                    className={styles.logo}
                />
                <div className={styles.textDetails}>
                    <h1 className={styles.airlineName}>{flight.name}</h1>
                    <p className={styles.flightNumber}>{flight.flightNumber ? flight.flightNumber : 'FIG4312'}</p>
                </div>
            </div>
            <div className={styles.flightTimes}>
                <p className={styles.duration}>{flight.duration}</p>
                <p className={styles.time}>
                    {flight.time}
                </p>
                <p className={styles.layover}>{flight.hnl}</p>
            </div>
        </div>
    );
}

const FlightPrice = ({ firstFlight, secondFlight, n, adults, minors, passengerNo = 1, vip = 0 }) => {
    const router = useRouter();

    const handleConfirm = async () => {
        try {
            // Storing data in localStorage
            await localStorage.setItem('firstFlight', JSON.stringify(firstFlight));
            await localStorage.setItem('secondFlight', JSON.stringify(secondFlight));
            await localStorage.setItem('adults', adults);
            await localStorage.setItem('minors', minors);

            // Navigating to the next page
            router.push('/explore/passengers-info');
        } catch (error) {
            console.error("Error saving flight data: ", error);
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.flightDetails}>
                {firstFlight && flightCard(firstFlight)}
                {
                    secondFlight && (
                        <div className={styles.separator}>
                            <Image className={styles.divider} src={separator} alt={"------------"}/>
                        </div> )
                }
                {
                    secondFlight &&
                        (flightCard(secondFlight))
                }
            </div>
            <div className={styles.priceDetails}>
                <div style={{flex: '1'}}></div>
                <div className={styles.cartLabel}>
                    {vip !== 0 && <p style={{marginBottom:"10px"}}>Seat upgrade</p>}
                    <p>Subtotal</p>
                    <p>Taxes and Fees</p>
                    <p>Total</p>
                </div>

                <div className={styles.cartPrice}>
                    {vip !== 0 && <p style={{marginBottom:"10px"}}>{199 * vip}</p>}
                    <p>${(firstFlight.price + (secondFlight?.price? secondFlight.price : 0) - 121) * passengerNo}</p>
                    <p>${(121*passengerNo)}</p>
                    <p>${(firstFlight.price + (secondFlight?.price? secondFlight.price : 0))* passengerNo + 199 * vip}</p>
                </div>
            </div>
            <div className={styles.priceDetails}>
                <div style={{flex: '1'}}></div>
                {n === 1 ?
                    <Link href='/' className={styles.saveBtn}>
                        <p>
                            Save & Close
                        </p>
                    </Link> : n === 0 ?
                    <button onClick={() => handleConfirm()} className={styles.doneBtn}>
                        <p>
                            Passenger information
                        </p>
                    </button>:
                        null
                }
            </div>
        </div>
    );
};

export default FlightPrice;
