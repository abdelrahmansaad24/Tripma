"use client"

import styles from "./PriceGraph.module.css";
import { useState } from "react";

const Grid = () => {
    const [data, setData] = useState([
        [[""], ["2/12", false], ["2/13", false], ["2/14", false], ["2/15", false], ["2/16", false]],
        [["3/7", false], ["$837", false], ["$592", false], ["$592", false], ["$1,308", false], ["$837", false]],
        [["3/8", false], ["$837", false], ["$592", false], ["$592", false], ["$837", false], ["$1,308", false]],
        [["3/9", false], ["$624", false], ["$592", false], ["$624", false], ["$592", false], ["$592", false]],
        [["3/10", false], ["$1,308", false], ["$624", false], ["$624", false], ["$837", false], ["$837", false]],
        [["3/11", false], ["$592", false], ["$624", false], ["$1,308", false], ["$837", false], ["$624", false]],
    ]);

    const [selectedCells, setSelectedCells] = useState([]);
    const [hoveredCell, setHoveredCell] = useState(null); // Track the hovered cell

    const handleCellClick = (rowIndex, colIndex) => {
        const newSelection = [...selectedCells];
        const index = newSelection.findIndex(([r, c]) => r === rowIndex && c === colIndex);

        if (index === -1) {
            newSelection.push([rowIndex, colIndex]);
        } else {
            newSelection.splice(index, 1);
        }

        setSelectedCells(newSelection);
    };

    const handleHover = (rowIndex, colIndex) => {
        setHoveredCell([rowIndex, colIndex]);
        handleCellClick(rowIndex,colIndex);
    }

    const getCellStyle = (rowIndex, colIndex) => {
        const isSelected = selectedCells.some(([r, c]) => r === rowIndex && c === colIndex);
        const isHovered = hoveredCell && hoveredCell[0] === rowIndex && hoveredCell[1] === colIndex;
        const isInLowerColumn = selectedCells.some(([r, c]) => r > rowIndex && c === colIndex);
        const isInLowerRow = selectedCells.some(([r, c]) => r === rowIndex && c > colIndex);

        if (isSelected || isHovered) {
            return { backgroundColor: "#605deb", color: "white" }; // Selected or hovered cell style
        } else if (isInLowerColumn || isInLowerRow) {
            return { backgroundColor: "#f0effb" }; // Style for lower cells in the same column
        }

        return {};
    };

    const handelBorder = (row, col, border) => {
        let x = getCellStyle(row,col)
        x[border]='none'
        return x;
    }

    return (
        <div>
            <div>
                <h1 className={styles.header}>
                    <span>Price grid</span> (flexible dates)
                </h1>
            </div>
            <div className={styles.gridContainer}>
                <div className={styles.gridRow}>
                    {data[0].map((date, idx) =>
                        idx === 0 ? (
                            <p key={idx} className={styles.gridHead}>
                                {date[0]}
                            </p>
                        ) : idx !== 5?(
                            <p key={idx} className={styles.gridTextHead} style={getCellStyle(0, idx)}>
                                {date[0]}
                            </p>) :
                            <p key={idx} className={styles.gridTextHead} style={handelBorder(0, idx,'borderRight')}>
                                {date[0]}
                            </p>
                )}
                </div>
                {data.map((row, rowIndex) =>
                    rowIndex === 0 ? null : (
                        <div key={rowIndex} className={styles.gridRow} style={rowIndex === 5? {borderBottom:"none"} : null}>
                            {row.map((cell, colIndex) => (
                                colIndex === 0 ?
                                    <p
                                        key={colIndex}
                                        className={styles.gridHead}
                                        style={getCellStyle(rowIndex, colIndex)}
                                    >
                                        {cell[0]}
                                    </p>:
                                        <p
                                            key={colIndex}
                                            className={styles.gridText}
                                            style={colIndex === 5?handelBorder(rowIndex, colIndex,'borderRight'): getCellStyle(rowIndex, colIndex)}
                                            onClick={() => handleCellClick(rowIndex, colIndex)}
                                            onMouseEnter={() => setHoveredCell([rowIndex, colIndex])}
                                            onMouseLeave={() => setHoveredCell(null)}
                                        >
                                            {cell[0]}
                                        </p>
                                ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Grid;
