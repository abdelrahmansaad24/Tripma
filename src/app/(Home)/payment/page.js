"use client";

import {
    AiFillApple,
    AiOutlineCreditCard,
    AiOutlineGoogle,
} from "react-icons/ai";
import { BsPaypal } from "react-icons/bs";
import { SiBitcoin } from "react-icons/si";
import { useRouter } from "next/navigation";
import FlightPrice from "@/app/components/flight-price/flightPrice";
import React, {useEffect, useState} from "react";
import { toast } from 'react-hot-toast';
import styles from "./page.module.css";
import cookies from "js-cookie";
import Cookies from "js-cookie";

const Page = () => {
    const router = useRouter();
    const [firstFlight, setFirstFlight] = useState(null);
    const [secondFlight, setSecondFlight] = useState(null);
    const [passengers, setPassengers] = useState([]);
    const [user, setUser] = useState(null);
    const [vip,setVip] = useState(0);
    const [valid, setValid] = useState(false);

    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [date, setDate] = useState("");
    const [ccv, setCcv] = useState("");

    // const submitInputs = (e) => {
    //     e.preventDefault();
    //
    //     if (
    //         name.trim() !== "" &&
    //         number.trim() !== "" &&
    //         ccv.trim() !== "" &&
    //         date.trim() !== ""
    //     ) {
    //         toast.success("Payment sent successfully");
    //         router.push("/payment/confirm");
    //     } else {
    //         toast.error("Please fill the card details");
    //     }
    // };

    const submitInputs = async () => {
        if(!validateInputs()){
            toast.error("Please fill the card details");
            return
        }
        const toastId = toast.loading("Processing...");
        // Prepare the data to be sent to the API
        const paymentData = {
            paymentInfo: {
                nameOnCard: name,
                cardNumber: number,
                expiryDate: date,
                ccv: ccv,
                userId: user,
            },
            passengers: passengers,
            flight1Id: firstFlight._id,
            flight2Id: secondFlight?._id || null,
            vip: vip,
        };

        try {
            // Call your API endpoint
            const response = await fetch("/api/user/reserve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Action completed successfully!", { id: toastId });
                // After successful reservation, redirect to the payment confirmation page
                router.push(`/payment/confirm/${result.payment._id}`);
            } else {
                // Handle the error if reservation fails
                toast.error(result.error || "Payment processing failed.", { id: toastId });
            }
        } catch (error) {
            console.error("Error submitting payment:", error);
            toast.error("An error occurred while processing the payment.", { id: toastId });
        }
    };


    const validateInputs = () => {
        return ccv.trim() !== "" && number.trim() !== "" && date.trim() !== "" && name.trim() !== "";
    }

    useEffect(() => {
        const fetchData = async () => {
            const firstFlight =await JSON.parse(await Cookies.get("firstFlight"));
            const secondFlight = await JSON.parse(await Cookies.get("secondFlight"));
            const customer = await JSON.parse(await Cookies.get("passengers"));
            const vipSeats = parseInt(await Cookies.get("vipSeats")) ;
            setFirstFlight(firstFlight);
            setSecondFlight(secondFlight);
            // const text = await JSON.parse(customer)
            await setPassengers(customer)
            setVip(vipSeats)
        }
        async function fetchUser() {
            try {
                const response = await fetch('/api/auth/verify');
                const data = await response.json();
                data && data.session && setUser(data.session.userId);

            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        fetchUser();
        fetchData();
    }, []);

    useEffect(()=>{
        setValid(validateInputs)
    },[ccv,date,name,number])

    const handleInputChange = (e) => {
        let value = e.target.value;

        // Remove non-digit characters
        value = value.replace(/[^0-9]/g, "");

        // Add "/" after the second digit
        if (value.length > 2) {
            value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }

        // Limit the length to 5 characters (MM/YY)
        if (value.length > 5) {
            value = value.slice(0, 5);
        }

        setDate(value);
    };


    return (
        <div className={styles.page}>
            <div className={styles.paySide}>
                <div className={styles.header}>
                    <h1 className={styles.titleh1}>Payment method</h1>
                    <p className={styles.description}>
                        Select a payment method below. Tripma processes your payment
                        securely with end-to-end encryption.
                    </p>
                </div>
                <div className={styles.paymentMethods}>
                    <p className={styles.activeMethod}>
                        <AiOutlineCreditCard />
                        <span>Credit card</span>
                    </p>
                    <p className={styles.paymentOption}>
                        <AiOutlineGoogle />
                        <span>Google pay</span>
                    </p>
                    <p className={styles.paymentOption}>
                        <AiFillApple />
                        <span>Apple pay</span>
                    </p>
                    <p className={styles.paymentOption}>
                        <BsPaypal />
                        <span>Pay pal</span>
                    </p>
                    <p className={styles.paymentOption}>
                        <SiBitcoin />
                        <span>Crypto</span>
                    </p>
                </div>
                <div className={styles.credit}>
                    <h2 className={styles.sectionTitle}>Credit card details</h2>
                    <form className={styles.form}>
                        <input
                            type="text"
                            placeholder="Name on card"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="number"
                            placeholder="Card Number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.cardDetails}>
                            <div style={{display:"flex",flexDirection:"column", width:"100%"}}>
                                <input
                                    type="text"
                                    placeholder="Expiration date"
                                    value={date}
                                    onChange={(e) => handleInputChange(e)}
                                    className={styles.input}
                                />
                                <p>MM/YY</p>

                            </div>
                            <input
                                type="number"
                                placeholder="CCV"
                                value={ccv}
                                onChange={(e) => setCcv(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </form>
                </div>
                <p className={styles.cancel}>
                    Cancellation policy
                </p>
                <p className={styles.cancelDetails}>
                    This flight has a flexible cancellation policy. If you cancel or change
                    your flight up to 30 days before the departure date, you are eligible for
                    a free refund. All flights booked on Tripma are backed by our satisfaction
                    guarantee, however cancellation policies vary by airline. See the <span style={{color:"#6c63ff",cursor:"pointer"}}>full cancellation policy</span> for this flight.
                </p>
                <div style={{display:"flex", flexDirection:"row", gap:"16px"}}>
                    <button className={styles.backButton}>
                        Back to seat select
                    </button>
                    <button
                        className={valid === true ? styles.done : styles.confirmButton}
                        onClick={submitInputs}
                    >
                        <p>Confirm and pay</p>
                    </button>
                </div>
            </div>
            <div className={styles.price}>
                {firstFlight&& <FlightPrice firstFlight={firstFlight} secondFlight={secondFlight} passengerNo={passengers.length} vip={vip} />}
                <button
                    className={valid === true ? styles.done : styles.confirmButton}
                    onClick={submitInputs}
                    style={{marginTop:20}}
                >
                    <p>Confirm and pay</p>
                </button>
            </div>
        </div>
    );
};

export default Page;

