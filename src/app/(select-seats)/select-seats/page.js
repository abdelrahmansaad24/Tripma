"use client"

import React, {useEffect, useRef, useState} from "react";
import plane from "@/assets/apple-icon - Copy.svg";
import Image from "next/image";
import plane2 from "@/assets/apple-icon - Copy - Copy.svg";
import inner from "@/assets/planeInner.svg";
import styles from "./page.module.css";
import right from "@/assets/windowRight.svg";
import left from "@/assets/windowLeft.svg";
import exit from "@/assets/exit.svg";
import Content from "@/app/(select-seats)/copmonents/content";
import Cookies from "js-cookie";
import {toast} from "react-hot-toast";
import tail from "@/assets/Screenshot 2024-12-26 121940.png";
import cookies from "js-cookie";
import {useRouter} from "next/navigation";
const Page = () => {
    const [flight1, setFlight1] = useState({})
    const [flight2, setFlight2] = useState({})
    const [passengers, setPassengers] = useState({})
    const [seats, setSeats] = useState([2, 5, 9, 22, 35]); // Example of unavailable seats
    const [currentPassenger, setCurrentPassenger] = useState([]);
    const [selected, setSelected] = useState([]); // Currently selected seats
    const [availableSeats, setAvailableSeats] = useState(170); // Total available seats
    const [flightsNo, setFlightsNo] = useState(2)
    const vip = 20;
    const rowsVip = Math.ceil(vip / 4); // Calculate number of VIP rows (4 seats per row)
    const [vipSeats, setVipSeats] = useState(0);
    const rowsEconomy = Math.ceil((availableSeats - vip) / 6); // Economy rows (6 seats per row)
    const [submit, setSubmit] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const firstFlight =await JSON.parse(await Cookies.get("firstFlight"));
            const secondFlight = await JSON.parse(await Cookies.get("secondFlight"));
            const customer = await JSON.parse(await Cookies.get("passengers"));
            setFlight1(firstFlight);
            setFlight2(secondFlight);
            // const text = await JSON.parse(customer)
            await setPassengers(customer)
        }
        fetchData();
    },[])

    useEffect(() => {
        setFlightsNo(flight2 === null ? 0 : 2);
    },[flight2])

    useEffect(() => {
        console.log(passengers.length)
        setSeats(flight1['seats'] || []);
    }, [flight1]);

    useEffect(() => {
        const index = Math.max(selected.length - 1,0)
        // console.log(passengers[0])
        let seat;
        const chars = ['A', 'B', 'C', 'D', 'E', 'F'];
        if(selected[index] > vip){
            seat = Math.floor((selected[index]-vip -1)/6)+1 + rowsVip;
            seat = `${seat}${chars[(selected[index] -vip -1 )%6]}`;
        }
        else {
            seat = Math.floor((selected[index]-1)/4)+1;
            seat = `${seat}${chars[(selected[index]-1)%4]}`;
        }
        seat = seat === 'NaNundefined'? '---' : seat;
        if(passengers.length > 0){
            setCurrentPassenger([`${passengers[index]['firstName']} ${passengers[index]['lastName']}`, selected[index]<=vip, seat || '---']);
        }

    },[selected])
        // await Cookies.get("firstFlight");
    // const seats = 170
    // const [vip, setVip] = useState(20); // Number of total VIP seats
    const [notify, setNotify] = useState(false);
    function moveElementToEnd(arr, index) {
        // console.log("moveElementToEnd", arr, index)
        // console.log(selected)
        if (index >= 0 && index < arr.length) {
            const element = arr.splice(index, 1)[0];// Remove the element from the array
            arr.push(element); // Add the element to the end of the array
            }
        return arr;
    }

    const handleSeatClick = (seatNumber) => {
        if (seats.includes(seatNumber)) return; // Unavailable seat

        // Check if seat is already selected
        if (selected.includes(seatNumber)) {
            // return;
            // Deselect the seat
            setPassengers(moveElementToEnd(passengers,selected.indexOf(seatNumber)))
            setSelected(selected.filter((seat) => seat !== seatNumber));

        } else {
            // Ensure the number of selected seats does not exceed the number of passengers
            if (selected.length < passengers.length) {
                setSelected([...selected, seatNumber]);
            } else {
                toast.error(`You can only select ${passengers.length} seats.`);
            }
        }
    };

    const handleNotify = (seat) => {
        if (selected.length >= passengers.length) {
            toast.error(`You can only select ${passengers.length} seats.`);
        }
        else
            setNotify([true, seat]);
    }

    const handleConfirm = () => {
        setVipSeats((vip)=> vip+1)
        handleSeatClick(notify[1])
        setNotify(false);
    }
    const router = useRouter();
    const handleNext = async () => {
        if (selected.length < passengers.length) {
            toast.error(`Pick all seats before you go`);
            return;
        }
        if (flightsNo === 2) {
            setPassengers((passengers) => passengers.map((item, index) => ({
                ...item, // Spread the existing properties
                firstFlightSeat: selected[index], // Add the new element
            })));

            // cookies.set('passengersFlight1', JSON.stringify(passengers), { path: '/' });
            // cookies.set('firstFlightSelected', JSON.stringify(selected), { path: '/' });
            // cookies.set('flight1vipSeats', JSON.stringify(vipSeats), { path: '/' });
            setFlightsNo(1);
            setSelected([]);
            setSeats(flight2['seats'] || []);
        } else {
            let updatedPassengers;
            if (flightsNo === 0) {
                updatedPassengers = passengers.map((item, index) => ({
                    ...item, // Spread the existing properties
                    firstFlightSeat: selected[index], // Add the new element
                }));
            } else {

                updatedPassengers = passengers.map((item, index) => ({
                    ...item, // Spread the existing properties
                    secondFlightSeat: selected[index], // Add the new element
                }));
            }

            // Now update the state with the new passengers data
            setSubmit(true);
            await setPassengers(updatedPassengers);

        }
    }

    useEffect(() => {
        const navigate = async () => {
            if (submit) {
                await cookies.set('passengers', JSON.stringify(passengers), {path: '/'});
                // cookies.set('selected', JSON.stringify(selected), { path: '/' });
                await cookies.set('vipSeats', JSON.stringify(vipSeats), {path: '/'});
                router.push('/payment')
                toast.success('Passengers seats has been added successfully.');
            }
        }
        navigate()
    },[passengers])

    return (
        <>
            <div style={{marginLeft: '-15%', padding: '0'}}>
                {notify && <div className={styles.container}>
                    <div className={styles.notify}>
                        <h1>
                            Upgrade seat
                        </h1>
                        <p>
                            Upgrade your seat for only $199, and enjoy 45 percent more leg room, and seats that recline
                            40
                            percent more than economy.
                        </p>
                        <div className={styles.action}>
                            <div className={styles.cancel} onClick={() => setNotify(false)}>
                                Cancel
                            </div>
                            <div className={styles.confirm} onClick={handleConfirm}>
                                Upgrade for $199
                            </div>
                        </div>
                    </div>
                </div>
                }
                <div style={{width: "100%", position: "relative", marginTop: "40px"}}>
                    <Image src={plane} alt={"Plane npm background"} style={{width: "100%"}}/>
                    <Image src={left} alt="Left window" style={{position: "absolute", left: "23.5%", top: "23%"}}/>
                    <Image src={right} alt="Right window" style={{position: "absolute", left: "29%", top: "23%"}}/>
                    <Image src={inner} alt={"Seats layout"} style={{position: "absolute", left: "21.8%", top: "31%"}}/>

                    <div style={{position: "absolute", left: "22.4%", top: "50%"}}>
                        {/* VIP Section */}
                        <div className={styles.vip}>
                            {Array.from({length: rowsVip}).map((_, rowIndex) => (
                                <div key={rowIndex} className={styles.row}>
                                    {Array.from({length: 5}).map((_, seatIndex) => {
                                        const seatNumber = seatIndex < 2
                                            ? rowIndex * 4 + seatIndex + 1
                                            : rowIndex * 4 + seatIndex;
                                        const isUnavailable = seats.includes(seatNumber);
                                        const isSelected = selected.includes(seatNumber);

                                        if (seatIndex === 2) {
                                            return (
                                                <div key={rowIndex * 100} className={styles.rowNumber}>
                                                    <p>{rowIndex + 1}</p>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                key={seatNumber}
                                                className={styles.cell}
                                                onClick={() => {
                                                    if (isUnavailable)
                                                        return;
                                                    if (isSelected) {
                                                        handleSeatClick(seatNumber)
                                                        setVipSeats((vip) => vip - 1)
                                                    }
                                                    else
                                                        handleNotify(seatNumber)
                                                }}
                                                //handleSeatClick(seatNumber)}
                                                style={{
                                                    cursor: isUnavailable ? "not-allowed" : "pointer",
                                                    background: isUnavailable
                                                        ? "#e8e7fa"
                                                        : isSelected
                                                            ? "#eb5d7a"
                                                            : "#3ccbb1",
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Economy Section */}
                        <div className={styles.grayBackground} style={{height: `${48 * rowsEconomy}px`}}>
                            <div className={styles.economy}>
                                {Array.from({length: rowsEconomy}).map((_, rowIndex) => {
                                    const globalRowNumber = rowsVip + rowIndex + 1;
                                    const isExitRow = globalRowNumber === rowsVip + 1 || globalRowNumber === 14 || globalRowNumber === 19;

                                    return (
                                        <div key={rowIndex}>
                                            {isExitRow && (
                                                <div className={styles.exit}>
                                                    <Image src={exit} alt="Exit"/>
                                                    <p>Exit row</p>
                                                </div>
                                            )}

                                            <div className={styles.row}>
                                                {Array.from({length: 7}).map((_, seatIndex) => {
                                                    const seatNumber = seatIndex < 3 ? vip + rowIndex * 6 + seatIndex + 1 : vip + rowIndex * 6 + seatIndex;
                                                    const isUnavailable = seats.includes(seatNumber);
                                                    const isSelected = selected.includes(seatNumber);

                                                    if (seatIndex === 3) {
                                                        return (
                                                            <div key={rowIndex * 100} className={styles.rowNumber}>
                                                                <p>{globalRowNumber}</p></div>
                                                        );
                                                    }

                                                    return (
                                                        <div
                                                            key={seatNumber}
                                                            className={styles.seat}
                                                            onClick={() => {
                                                                if (!isUnavailable)
                                                                    handleSeatClick(seatNumber)

                                                            }}
                                                            style={{
                                                                cursor: isUnavailable ? "not-allowed" : "pointer",
                                                                background: isUnavailable
                                                                    ? "#e8e7fa"
                                                                    : isSelected
                                                                        ? "#eb5d7a"
                                                                        : "#4440e1",
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{width: '90vw', marginTop: '-6px', marginLeft: '6.52%'}}>
                    <Image  src={plane2} alt={"Plane bottom"}/>
                    <div style={{
                        position: "absolute",
                        marginTop: '-6px',
                        marginLeft: "-18.2vw",
                        width: '83.4%',
                        // height:'60%',
                        zIndex: '-2'
                    }}>
                        <Image style={{width:'100%',height:'100%'}} src={tail} alt={'tail'}/>
                    </div>
                </div>

            </div>
            <div className={styles.content}>
                <Content currentPassenger={currentPassenger} from={flight1.departure} to={flight1.arrival}
                         start={[flight1.startDate,flight1 && flight1.time && flight1.time.split(' - ') ]}
                         end={[flight2 && flight2.startDate,flight2 && flight2.time && flight2.time.split(' - ') ]}
                         flightNo={flightsNo} handleNext={handleNext} done={selected.length === passengers.length}/>
            </div>
        </>
    );
};

export default Page;
