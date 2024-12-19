import React, { useState } from "react";
import styles from "./flights.module.css";
import Filter from "@/app/components/search/filter";
// import FlightCard from "@/app/components/cards/flightCard";
// import Image from "next/image";
// import china from '@/assets/logo/AirChina.png'
// import france from '@/assets/logo/AirFrance.png'
// import delta from '@/assets/logo/DeltaAirlines.png'
// import emirates  from '@/assets/logo/Emirates.png'
// import eva from '@/assets/logo/EVAAir.png'
// import hawaiian from '@/assets/logo/HawaiianAirlines.png'
// import japan from '@/assets/logo/JapanAirlines.png'
// import Korean from '@/assets/logo/KoreanAir.png'
// import quantas from '@/assets/logo/QantasAirlines.png'
// import united from '@/assets/logo/UnitedAirlines.png'

import Link from 'next/link'
// import PriceGrid from "@/app/components/charts/priceGrid";
// import Map from "@/app/components/map";

const Flights = () => {
    const [state, setState] = useState({
        maxPrice: null,
        time: null,
        airline: null,
        flightClass: null,
    });

    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const [priceShown, setPriceShow] = useState(true);

    return (
        <>
            <Filter state={state} handleSelectChange={handleSelectChange}/>
            <div className={styles.container}>
                <div className={styles.flights}>
                    <div className={styles.header}>
                        <h1 className={styles.h1}>
                            Choose a <span style={{color:"#605DEC"}} >departing </span>/{" "}
                            <span style={{color:"#605DEC"}}>returning </span>flight
                        </h1>
                    </div>
                    <div
                        className={styles.results}>
                        <div
                            className={styles.card}
                            onClick={() => setPriceShow(false)}
                        >
                        {/*    <FlightCard*/}
                        {/*        img={hawaiian}*/}
                        {/*        duration="16h 45m"*/}
                        {/*        name="Hawaiian Airlines"*/}
                        {/*        time="7:00AM - 4:15PM"*/}
                        {/*        stop="1 stop"*/}
                        {/*        hnl="2h 45m in HNL"*/}
                        {/*        price="$624"*/}
                        {/*        trip="round trip"*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*<div*/}
                        {/*    className={styles.card}*/}
                        {/*    onClick={() => setPriceShow(false)}*/}
                        {/*>*/}
                        {/*    <FlightCard*/}
                        {/*        img={japan}*/}
                        {/*        duration="18h 22m"*/}
                        {/*        name="Japan Airlines"*/}
                        {/*        time="7:35AM - 12:15PM"*/}
                        {/*        stop="1 stop"*/}
                        {/*        hnl="50m in HKG"*/}
                        {/*        price="$663"*/}
                        {/*        trip="round trip"*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*<div*/}
                        {/*    className={styles.card}*/}
                        {/*    onClick={() => setPriceShow(false)}*/}
                        {/*>*/}
                        {/*    <FlightCard*/}
                        {/*        img={delta}*/}
                        {/*        duration="18h 52m"*/}
                        {/*        name="Delta Airlines"*/}
                        {/*        time="9:47 AM - 4:15 PM"*/}
                        {/*        stop="1 stop"*/}
                        {/*        hnl="4h 05m in ICN"*/}
                        {/*        price="$756"*/}
                        {/*        trip="round trip"*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*<div*/}
                        {/*    className={styles.card}*/}
                        {/*    onClick={() => setPriceShow(false)}*/}
                        {/*>*/}
                        {/*    <FlightCard*/}
                        {/*        img={quantas}*/}
                        {/*        duration="15h 45m"*/}
                        {/*        name="Qantas Airlines"*/}
                        {/*        time="10:55 AM - 8:15 PM"*/}
                        {/*        stop="Nonstop"*/}
                        {/*        price="$839"*/}
                        {/*        trip="round trip"*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*<div*/}
                        {/*    className={styles.card}*/}
                        {/*    onClick={() => setPriceShow(false)}*/}
                        {/*>*/}
                        {/*    <FlightCard*/}
                        {/*        img={united}*/}
                        {/*        duration="16h 05m"*/}
                        {/*        name="United Airlines"*/}
                        {/*        time="11:15 AM - 7:45 PM"*/}
                        {/*        stop="Nonstop"*/}
                        {/*        price="$837"*/}
                        {/*        trip="round trip"*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*<div*/}
                        {/*    className={styles.card}*/}
                        {/*    onClick={() => setPriceShow(false)}*/}
                        {/*>*/}
                        {/*    <FlightCard*/}
                        {/*        img={france}*/}
                        {/*        duration="18h 30m"*/}
                        {/*        name="France Airlines"*/}
                        {/*        time="10:15 AM - 8:45 PM"*/}
                        {/*        stop="Nonstop"*/}
                        {/*        price="$964"*/}
                        {/*        trip="round trip"*/}
                        {/*    />*/}
                        </div>
                    </div>
                    <div className={styles.map}>
                        {/*<Map />*/}
                        {/*<Image src={map} alt="map" className="w-full h-full object-cover"/>*/}
                    </div>
                </div>

                {priceShown && (
                    null// <PriceGrid/>
                )}

                {/*{!priceShown && (*/}
                {/*    <div className="mt-10 flex flex-col gap-10 justify-end items-start lg:items-end">*/}
                {/*        <PriceDetails/>*/}
                {/*        <Link href='/passenger-info' className="mt-5">*/}
                {/*            <button*/}
                {/*                className="text-[#605DEC] border-2 border-[#605DEC] py-2 px-3 rounded hover:bg-[#605DEC] hover:text-white transition-all duration-200">Save*/}
                {/*                & Close*/}
                {/*            </button>*/}
                {/*        </Link>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </>
    );
};

export default Flights;
