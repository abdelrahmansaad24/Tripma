import dbConnect from "@/app/lib/dbConnect";
import Hotel from "@/app/lib/models/hotel";

export async function GET(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url); // Parse query parameters
    const limit = parseInt(searchParams.get("limit"), 10) || null;

    try {
        const hotels = limit? await Hotel.findFirstHotels(limit) : await Hotel.findAllHotels();
        return new Response(
            JSON.stringify(hotels),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
