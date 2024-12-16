import dbConnect from "@/app/lib/dbConnect";
import Package from "@/app/lib/models/package";

export async function GET(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url); // Parse query parameters
    const limit = parseInt(searchParams.get("limit"), 10) || 3;

    try {
        const packages = await Package.findFirstPackages(limit)
        return new Response(
            JSON.stringify(packages),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
