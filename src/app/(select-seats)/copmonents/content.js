
// import React, {useEffect, useState} from 'react';
import React from 'react'
import content from "@/assets/content.png"
import content2 from "@/assets/content2.png"
import selected from "@/assets/selected.png"
import contentSingle from "@/assets/content-singel.png"
import Image from "next/image"
import styles from "./content.module.css"
import {formatDate} from "date-fns";
// import {useRouter} from "next/navigation";
const Content = ({currentPassenger,from,to,start,end,handleNext,flightNo,done}) => {
    const date = start [0] !== undefined && start[0]?.split('/')
    const startDate = date && `${formatDate(`${date[0]}-${date[1]}-${date[2]}`,"MMM dd")} - ${start[1][0]}`

    const date2 = end[0] !== undefined && end[0]?.split('/')
    const endDate = date2 && `${formatDate(`${date2[0]}-${date2[1]}-${date2[2]}`,"MMM dd")} - ${end[1][0]}`
    const left = currentPassenger[1]? '75%' : '20%'
    return (
        <div>
            <Image style={{width:'100%',height:'100%'}} fill={true} src={flightNo === 2? content : flightNo ===1? content2 : contentSingle} alt={'content'}/>
            <div className={styles.header}>
                <p className={styles.depart}>
                    {from}
                </p>
                <p className={styles.arrive}>
                    {to}
                </p>
                <p className={styles.departDate}>
                    {startDate}
                </p>
                {flightNo !== 0 && <p className={styles.arriveDate}>
                    {endDate}
                </p>}
            </div>
            <div style={{position:'absolute',top:"35%" , left:left,width:'10%'}}>
                <Image src={selected} alt={selected}/>
            </div>
            <div className={styles.footer}>
                <p className={styles.name}>
                    {currentPassenger[0]}
                </p>
                <p className={styles.seat}>
                    {currentPassenger[2] || '---' }
                </p>
                <div className={styles.buttonsRow}>
                    <div className={styles.saveButton}>
                        <p>
                            Save and close
                        </p>
                    </div>
                    <div className={done? styles.done: styles.doneButton} onClick={handleNext}>
                        <p>
                            {flightNo === 2 ?'Next Flight' : "Confirm"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;