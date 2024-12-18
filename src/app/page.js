import Hero from "@/app/components/hero/hero";
import Deals from "@/app/components/deals/deals";
import Link from "next/link";
import Feedback from "@/app/components/feedback/feedback";

export default function Home() {
  return (
      <div>
          <Hero/>
          <Deals length={4} color={"#605DEC"} type={'packages'}/>
          <Deals length={3} color={"#3bcab0"} type={'hotels'}/>
          <Link className={"Link"} href={'/hotels'}>
            <button className={"button"}>Explore more stays</button>
          </Link>
          <Feedback/>
      </div>
  );
}
