"use client"

import React, {useEffect, useState} from "react";
import styles from "./flights.module.css";
import Filter from "@/app/components/search/filter";
import {useSearchParams} from "next/navigation";
import {format, parse} from "date-fns";
import PriceGrid from "@/app/components/analysis/priceAnalysis";
import FlightCard from "@/app/components/cards/flightCard";
import FlightPrice from "@/app/components/flight-price/flightPrice";
import map from "@/assets/Map.png"
import Image from "next/image"

const Flights = ({startDate,endDate,departure,arrival,adults,minors,roundTrip}) => {

    const initialStartDate = startDate
        ? parse(startDate, "dd/MM/yyyy", new Date())
        : null;

    const initialEndDate = endDate
        ? parse(endDate, "dd/MM/yyyy", new Date())
        : null;

    const [searchState, setSearchState] = useState({
        departure: departure || "",
        arrival: arrival || "",
        startDate: initialStartDate instanceof Date && !isNaN(initialStartDate)
            ? format(initialStartDate, "dd/MM/yyyy")
            : null,
        endDate: initialEndDate instanceof Date && !isNaN(initialEndDate)
            ? format(initialEndDate, "dd/MM/yyyy")
            : null,
        adults: parseInt(adults) || 1,
        minors: parseInt(minors) || 0,
        roundTrip: roundTrip || false,
    });
    useEffect(() => {
        setSearchState({
            departure: departure || "",
            arrival: arrival || "",
            startDate: initialStartDate instanceof Date && !isNaN(initialStartDate)
                ? format(initialStartDate, "dd/MM/yyyy")
                : null,
            endDate: initialEndDate instanceof Date && !isNaN(initialEndDate)
                ? format(initialEndDate, "dd/MM/yyyy")
                : null,
            adults: parseInt(adults) || 1,
            minors: parseInt(minors) || 0,
            roundTrip: roundTrip || false,
        })
    },[startDate,endDate,departure,arrival,adults,minors,roundTrip])
    const [allFlights, setAllFlights] = useState([])
    const [flights, setFlights] = useState([]);
    const [noOfFlights, setNoOfFlights] = useState(()=> searchState.roundTrip? 2:0)

    const buildQuery = (queryParams) => {
        // alert(state.date)
        return Object.entries(queryParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&");
    };

    useEffect(() => {
        const fetchFlights = async () => {
            let queryObject = {}
            if(noOfFlights === 1){
                queryObject = {
                    availableSeat: searchState.adults + searchState.minors,
                    arrival: searchState.departure,
                    departure: searchState.arrival,
                    startDate: searchState.endDate,
                    roundTrip: searchState.roundTrip,
                };
            }
            else {
                queryObject = {
                    availableSeat: searchState.adults + searchState.minors,
                    departure: searchState.departure,
                    arrival: searchState.arrival,
                    startDate: searchState.startDate,
                    roundTrip: searchState.roundTrip,
                };
            }
            // const queryObject = {
            //     availableSeat: searchState.adults + searchState.minors,
            //     departure: searchState.departure,
            //     arrival: searchState.arrival,
            //     startDate: searchState.startDate,
            //     roundTrip: searchState.roundTrip,
            // };
            try {
                console.log(queryObject);
                const response = await fetch(`/api/flights?${buildQuery(queryObject)}`);
                const data = await response.json();
                setAllFlights(data.result || []);
            } catch (error) {
                console.error("Failed to fetch flights:", error);
            }
        };

        fetchFlights();
    }, [searchState,noOfFlights]);


    const [filter, setFilter] = useState({
        maxPrice: null,
        time: null,
        airline: null,

        flightClass: null,
    });

    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        setFilter((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const [priceShown, setPriceShow] = useState(true);

    const timeToMinutes = (timeStr) => {
        timeStr = timeStr.trim()
        const [time, period] = timeStr.split(" "); // Split time and AM/PM
        let [hours, minutes] = time.split(":").map(Number); // Split into hours and minutes
        if (period === "PM" && hours !== 12) hours += 12; // Convert PM hours to 24-hour format
        if (period === "AM" && hours === 12) hours = 0; // Handle midnight
        return hours * 60 + (minutes || 0); // Return total minutes
    };

    useEffect(() => {
        const filteredFlights = allFlights.filter((flight) => {
            // Check time
            let isWithinTimeRange;
            if(filter.time){
                const flightStartTime = flight.time.split(" - ")[0]; // Extract start time
                const startMinutes = timeToMinutes(filter.time.split(' - ')[0]);
                const endMinutes = timeToMinutes(filter.time.split(' - ')[1]);
                const flightStartMinutes = timeToMinutes(flightStartTime.slice(0, -2) + ' ' + flightStartTime.slice(-2));

                // Check if flight start time is within range
                isWithinTimeRange =
                    flightStartMinutes >= startMinutes && flightStartMinutes <= endMinutes;

            }else {
                isWithinTimeRange = true;
            }
            // isWithinTimeRange = true
            // console.log(filter)
            // Check maxPrice
            const isWithinPrice = filter.maxPrice ? flight.price <= filter.maxPrice : true;
            // Check airline
            const matchesAirline = filter.airline ? flight.name.toLocaleLowerCase().includes(filter.airline) : true;
            // Check flight class
            const matchesClass = filter.flightClass ? flight.class === filter.flightClass : true;

            return isWithinPrice && isWithinTimeRange && matchesAirline && matchesClass;
        });
        setFlights(filteredFlights);

    }, [allFlights,filter]);

    const [selectedFlight, setSelectedFlight ] = useState([null,null]);

    const handelSelectedFlights = (flight)=>{
        if(noOfFlights === 2){
            setSelectedFlight([flight,null]);
            setNoOfFlights(1)
        } else if(noOfFlights === 1){
            setSelectedFlight((e)=> [e[0],flight]);
            setNoOfFlights(0)
        } else{
            if (selectedFlight[0] === null)
                setSelectedFlight([flight,null]);
        }
        setPriceShow(false);
    }

    return (
        <>
            <Filter state={filter} handleSelectChange={handleSelectChange}/>
            <div className={styles.container}>
                <div className={styles.flights}>
                    <div className={styles.header}>
                        <h1 className={styles.h1}>
                            Choose a {noOfFlights=== 0? null : noOfFlights === 2? <span style={{color: "#605DEC"}}>departing </span>:
                            <span style={{color: "#605DEC"}}>returning </span>}flight
                        </h1>
                    </div>
                    <div
                        className={styles.results}>
                        {
                            flights.map((flight, idx) => {
                                return (
                                    <div key={idx} className={styles.card} onClick={() => handelSelectedFlights(flight)}>
                                        <FlightCard
                                            img={flight.logo}
                                            duration={flight.duration}
                                            name={flight.name}
                                            time={flight.time}
                                            trip={flight.roundTrip? 'round trip': 'single trip'}
                                            stop={flight.stop!== '0' ? `${flight.stop} stop` : 'nonstop'}
                                            hnl={flight.hnl}
                                            price={`$${flight.price}`}
                                        />
                                    </div>
                                );
                            }
                            )
                        }
                    </div>
                    <div className={styles.map}>
                        <Image src={map} alt="map" className="w-full h-full object-cover"/>
                        <div>
                            <p style={{left:'34%', marginTop:'2px'}}>
                                {searchState.arrival}
                            </p>
                            <p style={{left:'58%'}}>
                                {searchState.departure}
                            </p>
                        </div>
                    </div>
                </div>

                {priceShown && (
                    <PriceGrid/>
                )}

                {!priceShown && (
                    <FlightPrice firstFlight={selectedFlight[0]} secondFlight={selectedFlight[1]} n={noOfFlights} adults={searchState.adults} minors={searchState.minors}/>
                    )}

            </div>
        </>
    );
};

export default Flights;
