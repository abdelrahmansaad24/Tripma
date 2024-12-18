"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./datePicker.module.css";

const TimePicker = ({handleDate}) => {
    const [tripType, setTripType] = useState("Round trip");
    const [selectedDates, setSelectedDates] = useState([null, null]);

    // Logic to handle date selection
    const handleDateChange = (dates) => {
        try {
            const [start, end] = dates;
            setSelectedDates([start, end || null]);
        }catch (e){
            setSelectedDates([dates, null])
        }

    };

    return (
        <>
            {/* Trip Type Selector */}
            <div className={styles.radioContainer}>
                <label style={{padding:"0",margin:'0'}}>
                    <input
                        type="radio"
                        name="tripType"
                        value="Round trip"
                        checked={tripType === "Round trip"}
                        onChange={(e) => {
                            setTripType(e.target.value);
                            setSelectedDates([selectedDates[0], null]); // Clear return date
                        }}
                    />{" "}
                    Round trip
                </label>
                <label style={{padding:"0",margin:'0'}}>
                    <input

                        type="radio"
                        name="tripType"
                        value="One way"
                        checked={tripType === "One way"}
                        onChange={(e) => {
                            setTripType(e.target.value);
                            setSelectedDates([selectedDates[0], null]); // Reset return date
                        }}
                    />{" "}
                    One way
                </label>
            </div>

            {/* Date Picker with Single Input */}
            <div className={styles.calendarContainer}>
                <DatePicker
                    minDate={Date.now()}
                    selected={selectedDates[0]}
                    onChange={handleDateChange}
                    startDate={selectedDates[0]}
                    endDate={tripType === "Round trip" ? selectedDates[1] : null}
                    selectsRange={tripType === "Round trip"}
                    monthsShown={2} // Show two months side by side
                    placeholderText={
                        tripType === "Round trip" ? "Depart - Return" : "Select departure date"
                    }
                    isClearable
                    className={styles.input}
                    open={true}
                />
            </div>

            {/* Done Button */}
            <button
                onClick={() =>
                    handleDate(selectedDates[0],selectedDates[1])
                }
                className={styles.doneButton}
            >
                Done
            </button>
        </>
    );
};

export default TimePicker;
