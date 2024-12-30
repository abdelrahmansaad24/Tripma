"use client"

import {useEffect, useState} from "react";
import { MdOutlineClose } from "react-icons/md";
import FlightCard from "@/app/components/cards/flightCard";
import creditCard from "@/assets/creditCard.svg";
import map1 from "@/assets/Map1.png";
import styles from "./page.module.css";
import Image from "next/image"
import Shop from "@/app/components/shop/shop"

const Page = () => {
    const [close, setClose] = useState(true);
    const [firstFlight, setFirstFlight] = useState(null);
    const [secondFlight, setSecondFlight] = useState(null);
    const [passengers, setPassengers] = useState([]);

    useEffect(() => {
        const flight1 = localStorage.getItem("firstFlight");
        setFirstFlight(JSON.parse(flight1));
        const flight2 = localStorage.getItem("secondFlight");
        setSecondFlight(JSON.parse(flight2));
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.leftContent}>
                {close && (
                    <div className={styles.notification}>
                        <p className={styles.notificationText}>
                            Your flight has been booked successfully! Your confirmation number is #381029404387
                        </p>
                        <MdOutlineClose
                            className={styles.closeIcon}
                            onClick={() => setClose(false)}
                        />
                    </div>
                )}

                <div>
                    <h1 className={styles.title}>Bon voyage, Sophia!</h1>
                    <p className={styles.subtitle}>Confirmation number: #381029404387</p>
                    <p className={styles.description}>
                        Thank you for booking your travel with Tripma! Below is a summary of your trip to Narita airport in Tokyo, Japan. We’ve sent a copy of your booking confirmation to your email address. You can also find this page again in <span className={styles.highlight}>My trips.</span>
                    </p>
                </div>

                <div className={styles.flightSummary}>
                    <h2 className={styles.sectionTitle}>Flight summary</h2>
                    <div className={styles.flightDetails}>
                        <p className={styles.text}>Departing February 25th, 2023</p>
                        {firstFlight &&
                            <div className={styles.flightCard}>
                                <FlightCard
                                    img={firstFlight.logo}
                                    duration="16h 45m"
                                    name="Hawaiian Airlines"
                                    time="7:00AM - 4:15PM"
                                    stop="1 stop"
                                    hnl="2h 45m in HNL"
                                    price="$624"
                                    trip="round trip"
                                />
                            </div>
                        }
                        <p className={styles.text}>Seat 9F (economy, window), 1 checked bag</p>

                        <p className={styles.text} style={{marginTop:'32px'}}>Departing February 25th, 2023</p>
                        {firstFlight &&
                            <div className={styles.flightCard}>
                                <FlightCard
                                    img={firstFlight.logo}
                                    duration="16h 45m"
                                    name="Hawaiian Airlines"
                                    time="7:00AM - 4:15PM"
                                    stop="1 stop"
                                    hnl="2h 45m in HNL"
                                    price="$624"
                                    trip="round trip"
                                />
                            </div>
                        }
                        <p className={styles.text}>Seat 9F (economy, window), 1 checked bag</p>
                    </div>
                </div>

                <div className={styles.priceBreakdown}>
                    <h2 className={styles.sectionTitle}>Price breakdown</h2>
                    <div className={styles.priceDetails}>
                        <div className={styles.priceLabels}>
                            <p className={styles.text}>Departing Flight:</p>
                            <p className={styles.text}>Arriving Flight:</p>
                            <p className={styles.text}>Baggage fees:</p>
                            <p className={styles.text}>Seat upgrade (business):</p>
                            <p className={styles.text}>Subtotal:</p>
                            <p className={styles.text}>Taxes (9.4%):</p>
                        </div>
                        <div className={styles.price}>
                            <p className={styles.text}>$251.50</p>
                            <p className={styles.text}>$251.50</p>
                            <p className={styles.text}>$0</p>
                            <p className={styles.text}>$199</p>
                            <p className={styles.text}>$702</p>
                            <p className={styles.text}>$66</p>
                        </div>
                    </div>
                    <hr/>
                    <p className={styles.total}>Amount paid:<span style={{flex:'1'}}>{' '}</span> $768</p>
                </div>

                <div className={styles.paymentMethod}>
                    <h2 className={styles.sectionTitle}>Payment method</h2>
                    <Image src={creditCard} alt="Credit Card" />
                </div>

                <div className={styles.itinerarySharing}>
                    <h2 className={styles.sectionTitle}>Share your travel itinerary</h2>
                    <p className={styles.sectionText}>You can email your itinerary to anyone by entering their email address here.</p>
                    <form className={styles.itineraryDetails} style={{marginTop:'16px'}}>
                        <input
                            type="text"
                            placeholder="Email address"
                            className={styles.input}
                        />
                        <button className={styles.button}>Email itinerary</button>
                    </form>
                </div>

                <div className={styles.flightRoute}>
                    <h2 className={styles.sectionTitle}>Flight Route</h2>
                    <Image src={map1} alt="Flight Map" className={styles.map} />
                </div>
            </div>

            <div>
                <Shop />
            </div>
        </div>
    );
};

export default Page;
