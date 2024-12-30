import React, {Suspense} from 'react';
import Search from "@/app/components/search/search";
import Deals from "@/app/components/deals/deals";
import Hotels from "@/app/components/deals/deals";
import styles from "./page.module.css"
import Flights from "@/app/components/flights-explore/flights";
import { redirect } from 'next/navigation'

const Page = async ({searchParams}) => {

    const suggestions = [
        "LAX", "JFK", "ORD", "DXB", "LHR", "SFO", "NRT",
        "CDG", "AMS", "SIN", "PEK", "SYD", "HND", "FRA",
        "YYZ", "ATL", "ICN",
    ];
    const departure = (await searchParams).departure;
    const arrival = (await searchParams).arrival;
    const startDate = (await searchParams).startDate;
    const endDate = (await searchParams).endDate;
    const date = (await searchParams).date;
    const roundTrip = (await searchParams).roundTrip || false;
    const adults = (await searchParams).adults;
    const minors = (await searchParams).minors;
    const handleSearch = () => {
        // href={}
        if (!departure) {
            redirect(`/`);
            return;
        }
        if (!arrival) {
            redirect(`/`);
            return;
        }
        if (!startDate) {
            redirect(`/`);
            return;
        }
        if (roundTrip && !endDate) {
            redirect(`/`);
            return;
        }
        if (!adults) {
            redirect(`/`);
            return;
        }

    }
    handleSearch()
    return (
        <>
            <div className={styles.searchHeader}>
                <div className={styles.searchContainer}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Search departure={departure} arrival={arrival} startDate={startDate} endDate={endDate}
                                adults={adults} minors={minors} date={date} roundTrip={roundTrip}
                        />
                    </Suspense>
                    {/*<div className="mt-16">*/}
                    {/*    <FlightChoose />*/}
                </div>
            </div>
            <Flights adults={adults} minors={minors} startDate={startDate} endDate={endDate}
                     arrival={arrival} departure={departure} roundTrip={roundTrip}
            />
            <Deals type={'hotels'} title1={'Find'} title2={'places to stay'} title3={'in Japan'}/>
            <Hotels title1={'People in'} title2={'San Francisco'} title3={'also searched for'}/>
        </>
    );
};

export default Page;
