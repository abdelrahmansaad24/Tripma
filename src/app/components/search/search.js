"use client";

import departure from "@/assets/departure.png";
import arrival from "@/assets/arrival.png";
import calendar from "@/assets/calendar.png";
import person from "@/assets/person.png";

import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format, parse } from "date-fns";
import styles from "./search.module.css";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const useAutoSuggest = (initialValue = "") => {
    const suggestions = [
        "LAX", "JFK", "ORD", "DXB", "LHR", "SFO", "NRT",
        "CDG", "AMS", "SIN", "PEK", "SYD", "HND", "FRA",
        "YYZ", "ATL", "ICN",
    ];

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

const Search = () => {
    const query = useSearchParams();
    const initialStartDate = query.get("startDate")
        ? parse(query.get("startDate"), "yyyy-MM-dd", new Date())
        : new Date();
    const initialEndDate = query.get("endDate")
        ? parse(query.get("endDate"), "yyyy-MM-dd", new Date())
        : null;

    const [state, setState] = useState({
        departure: query.get("departure") || "",
        arrival: query.get("arrival") || "",
        startDate: initialStartDate,
        endDate: initialEndDate,
        adults: parseInt(query.get("adults")) || 1,
        minors: parseInt(query.get("minors")) || 0,
        openDate: false,
        openOptions: false,
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
            startDate: format(state.startDate, "yyyy-MM-dd"),
            endDate: state.endDate ? format(state.endDate, "yyyy-MM-dd") : "",
            adults: state.adults,
            minors: state.minors,
        };

        return Object.entries(queryParams)
            .filter(([_, value]) => value) // Remove empty/undefined values
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&");
    };

    return (
        <div className={styles.search} ref={searchRef}>
            <div className={styles.buttons}>
                {/* Departure Input */}
                <div className={styles.placeInput}>
                    <Image src={departure} alt="Departure" />
                    <input
                        type="text"
                        placeholder="From where?"
                        value={departureSuggest.input}
                        onChange={departureSuggest.handleInputChange}
                        onFocus={() => {
                            departureSuggest.setIsOpen(true);
                            arrivalSuggest.setIsOpen(false);
                            setState((prev) => ({ ...prev, openDate: false, openOptions: false }));
                        }}
                        className={styles.textInput}
                    />
                    {departureSuggest.isOpen && (
                        <ul className={styles.drop}>
                            {departureSuggest.matchingSuggestions.map((suggestion) => (
                                <li
                                    key={suggestion}
                                    onClick={() => departureSuggest.handleSuggestionClick(suggestion)}
                                    className={styles.textButton}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Arrival Input */}
                <div className={styles.placeInput}>
                    <Image src={arrival} alt="Arrival" />
                    <input
                        type="text"
                        placeholder="Where to?"
                        value={arrivalSuggest.input}
                        onChange={arrivalSuggest.handleInputChange}
                        onFocus={() => {
                            arrivalSuggest.setIsOpen(true);
                            departureSuggest.setIsOpen(false);
                            setState((prev) => ({ ...prev, openDate: false, openOptions: false }));
                        }}
                        className={styles.textInput}
                    />
                    {arrivalSuggest.isOpen && (
                        <ul className={styles.drop}>
                            {arrivalSuggest.matchingSuggestions.map((suggestion) => (
                                <li
                                    key={suggestion}
                                    onClick={() => arrivalSuggest.handleSuggestionClick(suggestion)}
                                    className={styles.textButton}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Date Picker */}
                <div className={styles.date}>
                    <Image src={calendar} alt="Calendar" />
                    <span
                        className={styles.dateInput}
                        onClick={() =>
                            setState((prev) => ({
                                ...prev,
                                openDate: !prev.openDate,
                                openOptions: false,
                            }))
                        }
                    >
                        {state.openDate
                            ? `${format(state.startDate, "dd/MM/yyyy")} to ${state.endDate
                                ? format(state.endDate, "dd/MM/yyyy")
                                : "Select"}`
                            : "Depart to Return"}
                    </span>
                    {state.openDate && (
                        <DateRange
                            editableDateInputs={true}
                            onChange={(item) =>
                                setState((prev) => ({
                                    ...prev,
                                    startDate: item.selection.startDate,
                                    endDate: item.selection.endDate,
                                }))
                            }
                            moveRangeOnFirstSelection={false}
                            ranges={[
                                {
                                    startDate: state.startDate,
                                    endDate: state.endDate,
                                    key: "selection",
                                },
                            ]}
                            className={styles.absolute}
                        />
                    )}
                </div>

                {/* Person Picker */}
                <div className={styles.person}>
                    <Image src={person} alt="Person" />
                    <span
                        className={styles.personInput}
                        onClick={() =>
                            setState((prev) => ({
                                ...prev,
                                openOptions: !prev.openOptions,
                                openDate: false,
                            }))
                        }
                    >
                        {`${state.adults} Adult - ${state.minors} Minor`}
                    </span>
                    {state.openOptions && (
                        <div className={styles.optionsMenu}>
                            <div className={styles.optionItem}>
                                <span>Adults:</span>
                                <div>
                                    <button
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
                                <span>Minors:</span>
                                <div>
                                    <button
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

                {/* Search Button */}
                <Link href={`/explore?${buildQuery()}`} className={styles.fullWidth}>
                    <button className={styles.searchButton}>Search</button>
                </Link>
            </div>
        </div>
    );
};

export default Search;
