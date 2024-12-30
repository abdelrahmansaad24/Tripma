"use client";

import departImage from "@/assets/departure.png";
import arrivalImage from "@/assets/arrival.png";
import calendar from "@/assets/calendar.png";
import person from "@/assets/person.png";
import { toast } from 'react-hot-toast';
import {useEffect, useRef, useState} from "react";
import {format, parse} from "date-fns";
import styles from "./search.module.css";
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import TimePicker from "@/app/components/datePicker/timePicker";

const suggestions = [
    "LAX", "JFK", "ORD", "DXB", "LHR", "SFO", "NRT",
    "CDG", "AMS", "SIN", "PEK", "SYD", "HND", "FRA",
    "YYZ", "ATL", "ICN",
];
const useAutoSuggest = (initialValue = "") => {

    const [input, setInput] = useState(initialValue);
    const [matchingSuggestions, setMatchingSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (event) => {
        const inputValue = event.target.value.toLowerCase();
        setInput(inputValue);
        const filteredSuggestions = suggestions.filter((suggestion) =>
            suggestion.toLowerCase().startsWith(inputValue)
        );
        setMatchingSuggestions(filteredSuggestions);
    };

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
        setIsOpen(false);
    };

    return {
        input,
        matchingSuggestions,
        isOpen,
        setInput,
        setIsOpen,
        handleInputChange,
        handleSuggestionClick,
    };
};

const Search = ({startDate,endDate,adults,minors,date,departure,arrival, roundTrip }) => {
    const router = useRouter();

    const initialStartDate = startDate
        ? parse(startDate, "dd/MM/yyyy", new Date())
        : null;

    const initialEndDate = endDate
        ? parse(endDate, "dd/MM/yyyy", new Date())
        : null;

    const [state, setState] = useState({
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
        openDate: false,
        openOptions: false,
        roundTrip: roundTrip === null,
        date: date ? date : "Depart to Return",
    });

    const departureSuggest = useAutoSuggest(state.departure);
    const arrivalSuggest = useAutoSuggest(state.arrival);

    const closeSelectors = () => {
        setState((prevState) => ({
            ...prevState,
            openDate: false,
            openOptions: false,
        }));
        departureSuggest.setIsOpen(false);
        arrivalSuggest.setIsOpen(false);
    };

    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                closeSelectors();
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const buildQuery = () => {
        const queryParams = {
            departure: departureSuggest.input,
            arrival: arrivalSuggest.input,
            startDate: state.startDate,
            endDate: state.endDate ? state.endDate : "",
            adults: state.adults,
            minors: state.minors,
            date: state.date,
            roundTrip: state.roundTrip,
        };
        // alert(state.date)
        return Object.entries(queryParams)
            .filter(([_, value]) => value) // Remove empty/undefined values
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&");
    };

    const handleDate = (startDate, endDate, roundTrip,date) => {
        setState((prev) => ({
            ...prev,
            startDate: startDate && format(startDate, "dd/MM/yyyy"),
            endDate: endDate && format(endDate, "dd/MM/yyyy"),
            roundTrip: roundTrip,
            date: date,
        }));
        closeSelectors();
    };

    const handleSearch = () => {
        // href={}
        if(!suggestions.includes(departureSuggest.input)){
            toast.error("Please choose a valid departure airport");
            return;
        }
        if(!suggestions.includes(arrivalSuggest .input)){
            toast.error("Please choose a valid arrival airport");
            return;
        }
        if (!state.startDate){
            toast.error("Please choose a valid departure date");
            return;
        }
        if (state.roundTrip && !state.endDate){
            toast.error("Please choose a valid arrival date or switch to single trip");
            return;
        }
        router.push(`/explore?${buildQuery()}`);
    }

    return (
        <div className={styles.search} ref={searchRef}>
            <div className={styles.buttons}>
                <div className={styles.placeInput}>
                    <Image src={departImage} alt="Departure" />
                    <input
                        type="text"
                        placeholder="From where?"
                        value={departureSuggest.input}
                        onChange={departureSuggest.handleInputChange}
                        onFocus={() => {
                            departureSuggest.setIsOpen(true);
                            arrivalSuggest.setIsOpen(false);
                            setState((prev) => ({
                                ...prev,
                                openDate: false,
                                openOptions: false,
                            }));
                        }}
                        className={styles.textInput}
                    />
                    {departureSuggest.isOpen && (
                        <ul className={styles.drop}>
                            {departureSuggest.matchingSuggestions.map((suggestion) => (
                                <li
                                    key={suggestion}
                                    onClick={() =>
                                        departureSuggest.handleSuggestionClick(suggestion)
                                    }
                                    className={styles.textButton}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className={styles.placeInput}>
                    <Image src={arrivalImage} alt="Arrival" />
                    <input
                        type="text"
                        placeholder="Where to?"
                        value={arrivalSuggest.input}
                        onChange={arrivalSuggest.handleInputChange}
                        onFocus={() => {
                            arrivalSuggest.setIsOpen(true);
                            departureSuggest.setIsOpen(false);
                            setState((prev) => ({
                                ...prev,
                                openDate: false,
                                openOptions: false,
                            }));
                        }}
                        className={styles.textInput}
                    />
                    {arrivalSuggest.isOpen && (
                        <ul className={styles.drop}>
                            {arrivalSuggest.matchingSuggestions.map((suggestion) => (
                                <li
                                    key={suggestion}
                                    onClick={() =>
                                        arrivalSuggest.handleSuggestionClick(suggestion)
                                    }
                                    className={styles.textButton}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className={styles.date}>
                    <Image src={calendar} alt="Calendar" />
                    <span
                        className={styles.dateInput}
                        onClick={() => {
                            setState((prev) => ({
                                ...prev,
                                openDate: !prev.openDate,
                                openOptions: false,
                            }));
                            departureSuggest.setIsOpen(false);
                            arrivalSuggest.setIsOpen(false);
                        }}
                    >
                        {state.date}
                    </span>
                    {state.openDate && (
                        <div className={styles.absolute}>
                            <TimePicker handleDate={handleDate} />
                        </div>
                    )}
                </div>

                <div className={styles.person}>
                    <Image src={person} alt="Person" />
                    <span
                        className={styles.personInput}
                        onClick={() => {
                            setState((prev) => ({
                                ...prev,
                                openOptions: !prev.openOptions,
                                openDate: false,
                            }));
                            departureSuggest.setIsOpen(false);
                            arrivalSuggest.setIsOpen(false);
                        }}
                    >
                        {`${state.adults} Adult - ${state.minors} Minor`}
                    </span>
                    {state.openOptions && (
                        <div className={styles.optionsMenu}>
                            <div className={styles.optionItem}>
                                <span className={styles.textSpan}>Adults:</span>
                                <div className={styles.optionControls}>
                                    <button
                                        className={styles.optionButtons}
                                        onClick={() =>
                                            setState((prev) => ({
                                                ...prev,
                                                adults: Math.max(1, prev.adults - 1),
                                            }))
                                        }
                                    >
                                        -
                                    </button>
                                    <span>{state.adults}</span>
                                    <button
                                        className={styles.optionButtons}
                                        onClick={() =>
                                            setState((prev) => ({
                                                ...prev,
                                                adults: prev.adults + 1,
                                            }))
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className={styles.optionItem}>
                                <span className={styles.textSpan}>Minors:</span>
                                <div className={styles.optionControls}>
                                    <button
                                        className={styles.optionButtons}
                                        onClick={() =>
                                            setState((prev) => ({
                                                ...prev,
                                                minors: Math.max(0, prev.minors - 1),
                                            }))
                                        }
                                    >
                                        -
                                    </button>
                                    <span>{state.minors}</span>
                                    <button
                                        className={styles.optionButtons}
                                        onClick={() =>
                                            setState((prev) => ({
                                                ...prev,
                                                minors: prev.minors + 1,
                                            }))
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={handleSearch} className={styles.searchButton}>
                    <p>Search</p>
                </button>


                {/*<Link href={`/explore?${buildQuery()}`} className={styles.fullWidth}>*/}
                {/*    <button className={styles.searchButton}>Search</button>*/}
                {/*</Link>*/}
            </div>
        </div>
    );
};

export default Search;

