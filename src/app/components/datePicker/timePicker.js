"use client";

import { useState } from "react";
import styles from "./datePicker.module.css";
import Image from "next/image";
import left from "@/assets/left.svg";
import right from "@/assets/right.svg";
import calendar from "@/assets/calendar.png";
import {formatDate} from "date-fns";

const TimePicker = ({handleDate}) => {
    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const [startMonthIndex, setStartMonthIndex] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
    const [isRoundTrip, setIsRoundTrip] = useState(true);

    const generateDays = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        const days = [];

        const prevMonthDaysInMonth = new Date(year, month, 0).getDate(); // Previous month days

        // Add days from the previous month for padding
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push([false, prevMonthDaysInMonth - i]); // Previous month days
        }

        const today = isRoundTrip ? (from ? new Date(from) : new Date()) : new Date();
        const toDate = to ? new Date(to) : null;
        const fromDate = from ? new Date(from) : null;

        const isToInCurrentMonth = toDate && toDate.getMonth() === month && toDate.getFullYear() === year;
        const isFromInCurrentMonth = fromDate && fromDate.getMonth() === month && fromDate.getFullYear() === year;

        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const isBeforeToday =
                year < today.getFullYear() ||
                (year === today.getFullYear() && month < today.getMonth()) ||
                (year === today.getFullYear() && month === today.getMonth() && day < today.getDate());

            const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
            const isFromDay = isFromInCurrentMonth && fromDate?.getDate() === day;
            const isToDay = isToInCurrentMonth && toDate?.getDate() === day;

            if (isBeforeToday) {
                days.push([false, day]); // Inactive day
            } else if (isToday) {
                if (isRoundTrip && from) {
                    days.push([true, day, true]); // Highlighted day for `from` date in round trip
                } else {
                    days.push([true, day]); // Active day
                }
            } else {
                if (isFromDay && !isRoundTrip) {
                    days.push([true, day, true]); // Selected `from` date in one-way trip
                } else if (isToDay) {
                    days.push([true, day, true]); // Selected `to` date
                } else {
                    days.push([true, day]); // Active day
                }
            }
        }

        // Add next month's days for padding to reach 42 days total
        const totalDays = 42;
        const nextMonthPadding = totalDays - days.length;
        for (let i = 1; i <= nextMonthPadding; i++) {
            days.push([false, i]); // Next month days
        }

        return days;
    };




    // Handle left/right navigation for months
    const handleMonthChange = (direction) => {
        const tody = new Date();
        const year = tody.getFullYear();
        const month = tody.getMonth();

        let newStartMonthIndex = startMonthIndex + direction * 2;
        if (newStartMonthIndex<=month && currentYear<=year){
            return
        }
        if (newStartMonthIndex < 0) {
            newStartMonthIndex = 12 + newStartMonthIndex; // Wrap around to previous year
            setCurrentYear(currentYear - 1);
        } else if (newStartMonthIndex >= 12) {
            newStartMonthIndex = newStartMonthIndex % 12; // Wrap around to next year
            setCurrentYear(currentYear + Math.floor((startMonthIndex + direction * 2) / 12));
        }

        setStartMonthIndex(newStartMonthIndex);
    };

    const handleDateSelect = (day, monthIndex) => {
        if (!day || !day[0]) return;
        const year = monthIndex === 0 ? currentYear+1 : currentYear;
        const selectedMonth = months[monthIndex % 12];
        if(!isRoundTrip) {
            setFrom(`${day}-${selectedMonth}-${year}`);
        }else {
            if (!from){
                setFrom(`${day}-${selectedMonth}-${year}`);
            }else if (to) {
                setFrom(`${day}-${selectedMonth}-${year}`);
                setTo(null);
            }else {
                setTo(`${day}-${selectedMonth}-${year}`)
            }
        }
        // from? alert(new Date(formatDate(from,"yyyy MMMM dd"))):null;
    };



    const calendarMonths = [
        { monthIndex: startMonthIndex, days: generateDays(currentYear, startMonthIndex) },
        {
            monthIndex: (startMonthIndex + 1) % 12,
            days: generateDays(
                (startMonthIndex + 1) === 12 ? currentYear + 1 : currentYear,
                (startMonthIndex + 1) % 12
            ),
        }
    ];

    return (
        <div className={styles.calendarContainer}>
            {/* Trip Type Toggle */}
            <div className={styles.header}>
                <div className={styles.tripToggle}>
                    <label className={styles.toggleLable}>
                        <input
                            type="radio"
                            name="tripType"
                            checked={isRoundTrip}
                            onChange={() => setIsRoundTrip(true)}
                        />
                        Round trip
                    </label>
                    <label className={styles.toggleLable}>
                        <input
                            type="radio"
                            name="tripType"
                            checked={!isRoundTrip}
                            onChange={() => {
                                setIsRoundTrip(false)
                                setTo(null)
                            }}
                        />
                        One way
                    </label>
                </div>
                <div className={styles.date}>
                    <Image src={calendar} alt="Calendar"/>
                    <span
                        className={styles.dateInput}
                    >
                        {!isRoundTrip ? from? formatDate(from,"MMM dd")
                                : "Select Depart date" : !from ? "Depart to Return" :
                                `${formatDate(from,"MMM dd")} 
                                - ${to? formatDate(to,"MMM dd"): ""}`
                        }
                    </span>
                </div>
                <button onClick={()=> handleDate(from,to,(!isRoundTrip ? from? formatDate(from,"MMM dd")
                    : "Select Depart date" : !from ? "Depart to Return" :
                    `${formatDate(from,"MMM dd")}
                                - ${to? formatDate(to,"MMM dd"): ""}`
                ))} className={styles.doneBtn}>Done</button>
            </div>
            {/* Calendar View */}
            <div className={styles.months}>
                <div className={styles.arrows} onClick={() => handleMonthChange(-1)}>
                    <Image src={left} alt="left arrow" className={styles.arrow}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    {calendarMonths.map((calendar, idx) => (
                        <div key={idx} className={styles.month}>
                            <h6 className={styles.title}>
                                {months[calendar.monthIndex]} {calendar.monthIndex === 0? currentYear +1 : currentYear}
                            </h6>
                            <div className={styles.calendarGrid}>
                                <div className={styles.days}>
                                    {/* Weekday Headers */}
                                    <div className={styles.dayHeader}>S</div>
                                    <div className={styles.dayHeader}>M</div>
                                    <div className={styles.dayHeader}>T</div>
                                    <div className={styles.dayHeader}>W</div>
                                    <div className={styles.dayHeader}>T</div>
                                    <div className={styles.dayHeader}>F</div>
                                    <div className={styles.dayHeader}>S</div>
                                    {/* Days */}
                                    {calendar.days.map((day, i) => (
                                        <div
                                            key={i}
                                            className={day[0] ? day[2]?styles.seletedDay: styles.activeDay : styles.inactiveDay}
                                            onClick={() =>
                                                handleDateSelect(day, calendar.monthIndex)
                                            }
                                        >
                                            {day[1] || ""}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                <div className={styles.arrowsRight} onClick={() => handleMonthChange(1)}>
                    <Image src={right} alt="right arrow" className={styles.arrow}/>
                </div>
            </div>
        </div>
    );
};

export default TimePicker;
