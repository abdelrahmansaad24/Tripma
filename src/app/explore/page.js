"use client";

import React, { useEffect } from 'react';
import Search from "@/app/components/search/search";
import Link from "next/link";
import Deals from "@/app/components/deals/deals";
import Hotels from "@/app/components/deals/deals";
import styles from "./page.module.css"
import Flights from "@/app/components/flights-explore/flights";

const Page = () => {
    
    return (
        <>
            <div className={styles.header}>
                <div className={styles.container}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Search />
                    </Suspense>
                {/*<div className="mt-16">*/}
                {/*    <FlightChoose />*/}
                </div>

            </div>
            <Flights/>
            <Deals/>
            <Hotels/>
        </>
    );
};

export default Page;
