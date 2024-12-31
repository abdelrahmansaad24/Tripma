
import FlightCard from "@/app/components/cards/flightCard";
import creditCard from "@/assets/creditCard.svg";
import map1 from "@/assets/Map1.png";
import styles from "./page.module.css";
import Image from "next/image"
import Shop from "@/app/components/shop/shop"
import Notification from "@/app/(Home)/payment/confirm/[id]/notification";
import React from "react";

const Page = async ({params}) => {
    const response = await fetch(`https://tripma-eight.vercel.app/api/user/reservations?id=${await params.id}`);
    const data = await response.json();

    const {
        flight1,
        flight2,
        payment,
    } = data;

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        const date = new Date(year, month - 1, day); // Create a Date object

        const formatter = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });

        const formattedDate = formatter.format(date);
        const daySuffix = (n) =>
            ['st', 'nd', 'rd'][(n % 10) - 1] && ![11, 12, 13].includes(n % 100) ? ['st', 'nd', 'rd'][(n % 10) - 1] : 'th';

        // Add the ordinal suffix to the day
        return formattedDate.replace(
            /\d{1,2}/,
            (dayNumber) => `${dayNumber}${daySuffix(Number(dayNumber))}`
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftContent}>
                <Notification/>
                <div>
                    <h1 className={styles.title}>Bon voyage, Sophia!</h1>
                    <p className={styles.subtitle}>Confirmation number: #381029404387</p>
                    <p className={styles.description}>
                        Thank you for booking your travel with Tripma! Below is a summary of your trip to Narita airport
                        in Tokyo, Japan. We’ve sent a copy of your booking confirmation to your email address. You can
                        also find this page again in <span className={styles.highlight}>My trips.</span>
                    </p>
                </div>

                <div className={styles.flightSummary}>
                    <h2 className={styles.sectionTitle}>Flight summary</h2>
                    <div className={styles.flightDetails}>
                        <p className={styles.text}>Departing {parseDate(flight1.startDate)}</p>
                        {flight1 &&
                            <div className={styles.flightCard}>
                                <FlightCard
                                    img={flight1.logo}
                                    duration={flight1.duration}
                                    name={flight1.name}
                                    time={flight1.time}
                                    stop={`${flight1.stop} stop`}
                                    hnl={flight1.hnl || "no stop"}
                                    price={flight1.price}
                                    trip={flight1.roundTrip? "round trip": "single trip"}
                                />
                            </div>
                        }
                        {/*<p className={styles.text}>Seat 9F (economy, window), 1 checked bag</p>*/}
                        {flight2 &&(<>
                            <p className={styles.text} style={{marginTop: '32px'}}>Arriving {parseDate(flight2.startDate)}</p>
                           <div className={styles.flightCard}>
                                <FlightCard
                                    img={flight2.logo}
                                    duration={flight2.duration}
                                    name={flight2.name}
                                    time={flight2.time}
                                    stop={`${flight2.stop} stop`}
                                    hnl={flight2.hnl || "no stop"}
                                    price={flight2.price}
                                    trip={flight2.roundTrip? "round trip": "single trip"}
                                />
                            </div>
                        </>)
                        }
                        {/*<p className={styles.text}>Seat 9F (economy, window), 1 checked bag</p>*/}
                    </div>
                </div>

                <div className={styles.priceBreakdown}>
                    <h2 className={styles.sectionTitle}>Price breakdown</h2>
                    <div className={styles.priceDetails}>
                        <div className={styles.priceLabels}>
                            <p className={styles.text}>Departing Flight:</p>
                            {flight2 && <p className={styles.text}>Arriving Flight:</p>}
                            <p className={styles.text}>Baggage fees:</p>
                            <p className={styles.text}>Seat upgrade (business):</p>
                            <p className={styles.text}>Subtotal:</p>
                            <p className={styles.text}>Taxes (9.4%):</p>
                        </div>
                        <div className={styles.price}>
                            <p className={styles.text}>${flight1.price}</p>
                            {flight2 && <p className={styles.text}>${flight2.price}</p>}
                            <p className={styles.text}>${payment.baggageFees}</p>
                            <p className={styles.text}>${payment.seatsBusiness * 199 || 0}</p>
                            <p className={styles.text}>${Math.ceil(payment.total*0.906)}</p>
                            <p className={styles.text}>${Math.floor(payment.total * 0.094)}</p>
                        </div>
                    </div>
                    <hr/>
                    <p className={styles.total}>Amount paid:<span style={{flex: '1'}}>{' '}</span> ${payment.total}</p>
                </div>

                <div className={styles.paymentMethod}>
                    <h2 className={styles.sectionTitle}>Payment method</h2>
                    <Image src={creditCard} alt="Credit Card"/>
                </div>

                <div className={styles.itinerarySharing}>
                    <h2 className={styles.sectionTitle}>Share your travel itinerary</h2>
                    <p className={styles.sectionText}>You can email your itinerary to anyone by entering their email
                        address here.</p>
                    <form className={styles.itineraryDetails} style={{marginTop: '16px'}}>
                        <input
                            type="text"
                            placeholder="Email address"
                            className={styles.input}
                        />
                        <button className={styles.button}>Email itinerary</button>
                    </form>
                </div>

                <div className={styles.flightRoute} >
                    <h2 className={styles.sectionTitle}>Flight Route</h2>
                    <div style={{position:"relative", display:'flex', flexDirection:'column'}}>
                        <Image src={map1} alt="Flight Map" className={styles.map}/>
                        <div style={{position:"absolute",display:"flex", flexDirection:'row', top:'45%',width:'100%'}}>
                            <p style={{position:"absolute",left: '36%', margin: '0'}}>
                                {flight1.arrival}
                            </p>
                            <p style={{position:"absolute",left: '69%' ,marginTop:'-6px'}}>
                                {flight1.departure}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <div>
                <Shop/>
            </div>
        </div>
    );
};

export default Page;
