import dbConnect from "@/app/lib/dbConnect";
import Flight from "@/app/lib/models/flight";

export async function GET(req) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url); // Parse query parameters

        // Construct query object from URL search parameters
        const query = {};

        searchParams.forEach((value, key) => {
            key === 'availableSeat'? query[key] = { $gt: value }:  query[key] = value;
        });
        console.log(query);
        const flights = await Flight.findFlightsByQuery(query);

        return new Response(
            JSON.stringify(flights),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}