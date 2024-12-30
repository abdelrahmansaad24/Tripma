import dbConnect from "@/app/lib/dbConnect";
import PaymentManager from "@/app/lib/models/payment";
import FlightManager from "@/app/lib/models/flight";

export async function GET(req) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url); // Parse query parameters

        console.log(searchParams.get('id'));
        // Fetch payment details with the associated flights
        const payment = await PaymentManager.findPaymentById(searchParams.get('id'));
        if (!payment.success) {
            throw new Error(payment.error || "Failed to fetch payments.");
        }
        console.log(payment);

        // Enrich payment data with flight details if needed

        const flight1Details = payment.payment.firstFlightId
            ? await FlightManager.findFlightById(payment.payment.firstFlightId)
            : null;
        const flight2Details = payment.payment.secondFlightId
            ? await FlightManager.findFlightById(payment.payment.secondFlightId)
            : null;

        const enrichedPayments =  {
            payment: payment.payment,
            flight1: flight1Details?.success ? flight1Details.flight : null,
            flight2: flight2Details?.success ? flight2Details.flight : null,
        };
        return new Response(
            JSON.stringify(enrichedPayments),
            { status: 200, headers: { "Content-Type": "application/json" }}
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
