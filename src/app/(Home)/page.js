import Hero from "@/app/components/hero/hero";
import Deals from "@/app/components/deals/deals";
import Link from "next/link";
import Feedback from "@/app/components/feedback/feedback";
import {toast} from "react-hot-toast";
// className={'main'}
export default function Home({searchParams}) {

    return (
        <div>
            <Hero/>
            <Deals length={4} color={"#605DEC"} type={'packages'}/>
            <Deals length={3} color={"#3bcab0"} type={'hotels'} title1={'Explore unique'} title2={' places to stay'}/>
            <Link className={"Link"} href={'/hotels'}>
                <button className={"button"}>Explore more stays</button>
            </Link>
            <Feedback/>
        </div>
    );
}
