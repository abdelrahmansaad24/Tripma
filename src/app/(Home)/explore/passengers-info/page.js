"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import FlightPrice from "@/app/components/flight-price/flightPrice";
import Link from "next/link";
import Image from "next/image";
import bags from "@/assets/bag-69f1ddee.png";
import cookies from "js-cookie";
import {useRouter} from "next/navigation";
import { toast } from 'react-hot-toast';
import emergencyContact from "@/app/lib/models/emergencyContact";

const Page = () => {
    const [firstFlight, setFirstFlight] = useState("");
    const [secondFlight, setSecondFlight] = useState("");
    const [adults, setAdults] = useState(1);
    const [passengers, setPassengers] = useState([]);
    const [errors, setErrors] = useState(null);
    const router = useRouter();
    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        const flight1 = localStorage.getItem("firstFlight");
        setFirstFlight(JSON.parse(flight1));
        const flight2 = localStorage.getItem("secondFlight");
        setSecondFlight(JSON.parse(flight2));
        const adultsCount = parseInt(localStorage.getItem("adults")) || 1;
        setAdults(adultsCount);
        const minorsCount = parseInt(localStorage.getItem("minors")) || 0;


        // Initialize passengers array based on adults and minors
        const passengersArray = Array.from({ length: adultsCount + minorsCount }, (_, index) => ({
            id: index + 1,
            firstName: "",
            middleName: "",
            lastName: "",
            suffix: "",
            dob: "",
            email: "",
            phone: "",
            RedressNumber: "",
            knownTravellerNumber: "",
            type: index < adults ? "adult" : "minor",
            bags: 1,
            emergencyContact: {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
            },
            copyEmergencyContact: false,
        }));
        setPassengers(passengersArray);
    }, []);

    useEffect( () => {
        const validate = async () => {
            const validated = await validatePassengers();
            if (validated){
                setIsFormValid(true);
            }
            else {
                setIsFormValid(false);
            }
        }
        validate();
    },[passengers])

    const handleInputChange = (id, field, value) => {
        setPassengers((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
    };

    const handleEmergencyInputChange = (id, field, value) => {
        setPassengers((prev) =>
            prev.map((p) =>
                p.id === id
                    ? { ...p, emergencyContact: { ...p.emergencyContact, [field]: value } }
                    : p
            )
        );
    };

    const handleCopyEmergencyContact = (id, isChecked) => {
        if (isChecked) {
            const firstPassengerContact = passengers[0]?.emergencyContact;
            setPassengers((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? { ...p, emergencyContact: firstPassengerContact, copyEmergencyContact: true }
                        : p
                )
            );
        } else {
            setPassengers((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? {
                            ...p,
                            emergencyContact: { firstName: "", lastName: "", email: "", phone: "" },
                            copyEmergencyContact: false,
                        }
                        : p
                )
            );
        }
    };

    function scrollToInputWithStyle(styleObject) {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            const stylesMatch = Object.entries(styleObject).every(([key, value]) => {
                return input.style[key] === value;
            });
            if (stylesMatch) {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // input.focus();
            }
        });
    }

    const validatePassengers = async () => {
        await setErrors(null);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
        const newErrors = await Promise.all(
            passengers.map(async (passenger, index) => {
                const passengerErrors = {};
                if (!passenger.firstName) passengerErrors.firstName = "First name is required";
                if (!passenger.lastName) passengerErrors.lastName = "Last name is required";
                if (!passenger.dob) passengerErrors.dob = "Date of birth is required";
                if (!passenger.email) passengerErrors.email = "Email is required";
                if (!emailRegex.test(passenger.email)) passengerErrors.email = 'Invalid email format.';
                if (!passenger.phone) passengerErrors.phone = "Phone number is required";
                if (!phoneRegex.test(passenger.phone)) passengerErrors.phone = 'Invalid phone number format. Include country code if applicable.';
                if (!passenger.knownTravellerNumber) passengerErrors.knownTravellerNumber = "Traveler number is required";
                if (!phoneRegex.test(passenger.knownTravellerNumber)) passengerErrors.knownTravellerNumber = 'Invalid phone number format. Include country code if applicable.';
                if (!passenger.emergencyContact.firstName)
                    passengerErrors["emergencyContact.firstName"] = "Emergency contact first name is required";
                if (!passenger.emergencyContact.lastName)
                    passengerErrors["emergencyContact.lastName"] = "Emergency contact last name is required";
                if (!passenger.emergencyContact.email)
                    passengerErrors["emergencyContact.email"] = "Emergency contact email is required";
                if (!emailRegex.test(passenger.emergencyContact.email))
                    passengerErrors["emergencyContact.email"] = "Emergency contact email is not valid";
                if (!passenger.emergencyContact.phone)
                    passengerErrors["emergencyContact.phone"] = "Emergency contact phone number is required";
                if (!phoneRegex.test(passenger.emergencyContact.phone))
                    passengerErrors["emergencyContact.phone"] = "Emergency contact phone number is not valid";
                if (Object.keys(passengerErrors).length > 0) {
                    return { index, passengerErrors };
                }
                return null;
            })
        );

        const filteredErrors = newErrors.filter(error => error !== null);
        if (filteredErrors.length > 0) {
            const firstError = filteredErrors[0];
            const firstKey = Object.keys(firstError.passengerErrors)[0];
            let error = {};
            error[firstKey] = firstError.passengerErrors[firstKey];
            await setErrors([firstError.index, error]);
            // Define the style object with multiple style values
            const styleObject = {
                borderColor: 'red'};
            scrollToInputWithStyle(styleObject);
        }
        return filteredErrors.length === 0;
    };

    const handleSubmit = async () => {
        const error = await validatePassengers();

        if (await validatePassengers()) {
            // const cookieStore = cookies();
            cookies.set('passengers', JSON.stringify(passengers), { path: '/' });
            cookies.set('firstFlight', JSON.stringify(firstFlight), { path: '/' });
            cookies.set('secondFlight', JSON.stringify(secondFlight), { path: '/' });
            toast.success('Passengers Information has been added successfully.');
            router.push('/select-seats')
        }else {
            errors && toast.error(`Error in passenger ${errors[0]+1}: ${Object.values(errors[1])[0]}`);
        }

    };
    //
    // useEffect(() =>{
    //     errors && toast.error(`Error in passenger ${errors[0]+1}: ${Object.values(errors[1])[0]}`);
    // }, [errors])


    const height = 782* passengers.length + 330;
    return (
        <div className={styles.page} style={{height:height}}>
            <h2 className={styles.header}>Passenger information</h2>
            <p className={styles.headerText}>
                Enter the required information for each traveler and be sure that it exactly
                matches the government-issued ID presented at the airport.
            </p>
            <div className={styles.container}>
                <div className={styles.info}>
                    {passengers.map((passenger, index) => (
                        <div key={passenger.id} className={styles.passengerForm}>
                            <h3>
                                Passenger {index + 1} {index < adults ? " (Adult)" : " (Minor)"}
                            </h3>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    placeholder="First name*"
                                    value={passenger.firstName}
                                    style={{borderColor:errors && errors[0]=== index && errors[1].firstName ? "red": "#A1B0CC"}}
                                    onChange={(e) =>
                                        handleInputChange(passenger.id, "firstName", e.target.value)
                                    }
                                    required={true}
                                />
                                <input
                                    type="text"
                                    placeholder="Middle "
                                    value={passenger.middleName}
                                    onChange={(e) =>
                                        handleInputChange(passenger.id, "middleName", e.target.value)
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Last name*"
                                    value={passenger.lastName}
                                    style={{borderColor:errors && errors[0]=== index && errors[1].lastName ? "red": "#A1B0CC"}}
                                    onChange={(e) =>
                                        handleInputChange(passenger.id, "lastName", e.target.value)
                                    }
                                    required={true}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    placeholder="Suffix"
                                    value={passenger.suffix}
                                    onChange={(e) =>
                                        handleInputChange(passenger.id, "suffix", e.target.value)
                                    }
                                />
                                <input
                                    className={styles.dob}
                                    style={{borderColor:errors && errors[0]=== index && errors[1].dob ? "red": "#A1B0CC"}}
                                    type="date"
                                    placeholder="Date of Birth*"
                                    value={passenger.dob}
                                    max={new Date().toISOString().split('T')[0]} // Set max date to today
                                    onChange={(e) =>
                                        handleInputChange(passenger.id, "dob", e.target.value)
                                    }
                                    required={true}
                                />
                            </div>
                            <div className={styles.secondInputGroup} style={{ marginTop: "40px" }}>
                                <input
                                    type="text"
                                    style={{borderColor:errors && errors[0]=== index && errors[1].email ? "red": "#A1B0CC"}}
                                    placeholder="Email Address*"
                                    value={passenger.email}
                                    onChange={(e) =>
                                        handleInputChange(passenger.id, "email", e.target.value)
                                    }
                                    required={true}
                                />
                                <input
                                    type="number"
                                    placeholder="Phone number*"
                                    value={passenger.phone}
                                    style={{borderColor:errors && errors[0]=== index && errors[1].phone ? "red": "#A1B0CC"}}
                                    onChange={(e) =>
                                        handleInputChange(passenger.id, "phone", e.target.value)
                                    }
                                    required={true}
                                />
                            </div>
                            <div className={styles.secondInputGroup}>
                                <input
                                    type="text"
                                    placeholder="Redress number"
                                    value={passenger.RedressNumber}
                                    onChange={(e) =>
                                        handleInputChange(passenger.id, "RedressNumber", e.target.value)
                                    }
                                />
                                <input
                                    type="number"
                                    placeholder="Known traveller number*"
                                    value={passenger.knownTravellerNumber}
                                    style={{borderColor:errors && errors[0]=== index && errors[1].knownTravellerNumber ? "red": "#A1B0CC"}}
                                    onChange={(e) =>
                                        handleInputChange(passenger.id, "knownTravellerNumber", e.target.value)
                                    }
                                    required={true}
                                />
                            </div>
                            <p className={styles.emergencyHeader}>
                                Emergency contact information
                            </p>
                            <div className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={passenger.copyEmergencyContact}
                                    onChange={(e) =>
                                        handleCopyEmergencyContact(passenger.id, e.target.checked)
                                    }
                                />
                                <label>Same as Passenger 1</label>
                            </div>
                            <div className={styles.secondInputGroup}>
                                <input
                                    type="text"
                                    placeholder="First name*"
                                    value={passenger.emergencyContact.firstName}
                                    style={{borderColor:errors && errors[0]=== index && errors[1]['emergencyContact.firstName'] ? "red": "#A1B0CC"}}
                                    onChange={(e) =>
                                        handleEmergencyInputChange(
                                            passenger.id,
                                            "firstName",
                                            e.target.value
                                        )
                                    }
                                    required={true}
                                    disabled={passenger.copyEmergencyContact}
                                />
                                <input
                                    type="text"
                                    placeholder="Last name*"
                                    value={passenger.emergencyContact.lastName}
                                    style={{borderColor:errors && errors[0]=== index && errors[1]['emergencyContact.lastName'] ? "red": "#A1B0CC"}}
                                    onChange={(e) =>
                                        handleEmergencyInputChange(
                                            passenger.id,
                                            "lastName",
                                            e.target.value
                                        )
                                    }
                                    required={true}
                                    disabled={passenger.copyEmergencyContact}
                                />
                            </div>
                            <div className={styles.secondInputGroup}>
                                <input
                                    type="text"
                                    placeholder="Email address"
                                    value={passenger.emergencyContact.email}
                                    style={{borderColor:errors && errors[0]=== index && errors[1]['emergencyContact.email'] ? "red": "#A1B0CC"}}
                                    onChange={(e) =>
                                        handleEmergencyInputChange(
                                            passenger.id,
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    disabled={passenger.copyEmergencyContact}
                                />
                                <input
                                    type="text"
                                    placeholder="Phone number*"
                                    value={passenger.emergencyContact.phone}
                                    style={{borderColor:errors && errors[0]=== index && errors[1]['emergencyContact.phone'] ? "red": "#A1B0CC"}}
                                    onChange={(e) =>
                                        handleEmergencyInputChange(
                                            passenger.id,
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                    required={true}
                                    disabled={passenger.copyEmergencyContact}
                                />
                            </div>
                        </div>
                    ))}
                    <div className={styles.bagsInfo}>
                        <h3>
                            Bag information
                        </h3>
                        <p>
                            Each passenger is allowed one free carry-on bag and one personal item.
                            First checked bag for each passenger is also free. Second bag check fees
                            are waived for loyalty program members. See the
                            <span style={{color:"#605DEC", cursor:"pointer"}}> full bag policy.</span>
                        </p>
                        {passengers.map((passenger, index) => (
                            <div key={index} className={styles.bagInput}>
                                <div>
                                    <p style={{color: '#7C8DB0'}}>
                                        passenger {index + 1}
                                    </p>
                                    <p style={{color: '#6E7491'}}>
                                        {passenger.firstName? passenger.firstName : 'First'} {passenger.lastName? passenger.lastName: 'second'}
                                    </p>
                                </div>
                                <div>
                                    <p style={{color: '#7C8DB0'}}>
                                        Checked bags
                                    </p>
                                    <div style={{flexDirection:'row',alignItems:'center' , gap:"14px"}}>
                                        <button
                                            className={styles.optionButtons}
                                            onClick={() =>
                                                handleInputChange(passenger.id, "bags", Math.max(passenger.bags -1,0))
                                            }
                                        >
                                            -
                                        </button>
                                        <span>{passenger.bags}</span>
                                        <button
                                            className={styles.optionButtons}
                                            onClick={() =>
                                                handleInputChange(passenger.id, "bags",passenger.bags +1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.links}>
                        <Link href={"/"} className={styles.save}>
                            <p>Save and close</p>
                        </Link>
                        <button onClick={handleSubmit} className={isFormValid? styles.confirmDone:styles.done}>
                            <p>Select seats</p>

                        </button>
                    </div>
                </div>
                <div className={styles.price}>
                    {firstFlight && (
                        <FlightPrice firstFlight={firstFlight} secondFlight={secondFlight} passengerNo={passengers.length}/>
                    )}
                    <button onClick={handleSubmit} className={isFormValid? styles.confirm: styles.seats}>
                        <p>Select seats</p>
                    </button>
                    <Image src={bags} alt="Bags illustration"/>
                </div>
            </div>
        </div>
    );
};

export default Page;
