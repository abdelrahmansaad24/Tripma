import dbConnect from "@/app/lib/dbConnect";
import Flight from "@/app/lib/models/flight";
import PaymentManager from "@/app/lib/models/payment";
import PassengerManager from "@/app/lib/models/passenger";
import EmergencyContactManager from "@/app/lib/models/emergencyContact";
import mongoose from "mongoose";

export async function POST(req) {
    const session = await mongoose.startSession(); // Start a transaction session
    const db = await dbConnect();
    await db.startSession();
    // session.startTransaction();

    try {
        // console.log("POST");
        const data = await req.json();
        // console.log(data);
        const {
            paymentInfo,
            passengers,
            flight1Id,
            vip,
            flight2Id = null
        } = data;

        if (!paymentInfo || !passengers || !flight1Id) {
            return new Response(
                JSON.stringify({ success: false, error: "Missing required parameters." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Fetch flight details
        const flight1 = (await Flight.findFlightById(flight1Id)).flight;
        if (!flight1) {
            return new Response(
                JSON.stringify({ success: false, error: "Flight 1 not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }
        // console.log("here")
        let flight2 = null;
        if (flight2Id) {
            flight2 = (await Flight.findFlightById(flight2Id)).flight;
            if (!flight2) {
                return new Response(
                    JSON.stringify({ success: false, error: "Flight 2 not found." }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        }
        // console.log("here2")
        // Calculate total price
        const totalPrice = (flight1.price + (flight2 ? flight2.price : 0)) * passengers.length + vip*199;

        // Update seat availability and reserve seats
        passengers.forEach(passenger => {
            const reservedSeat = passenger.firstFlightSeat;

            if (flight1.seats.includes(reservedSeat)) {
                throw new Error(`Seat ${reservedSeat} on Flight 1 is already reserved.`);
            }
            flight1.seats.push(reservedSeat);
        });

        flight1.availableSeat -= passengers.length;

        if (flight2) {
            flight2.availableSeat -= passengers.length;
            passengers.forEach(passenger => {
                const reservedSeat = passenger.secondFlightSeat;
                if (flight2.seats.includes(reservedSeat)) {
                    throw new Error(`Seat ${reservedSeat} on Flight 2 is already reserved.`);
                }
                flight2.seats.push(reservedSeat);
            });
        }

        // console.log(flight1);
        await Flight.updateFlight(flight1._id,{seats:flight1.seats,availableSeat:flight1.availableSeat}, session );
        // await flight1.save();
        // console.log({seats: flight1.seats ,availableSeat: flight1.availableSeat});

        if (flight2) await Flight.updateFlight(flight2._id,{seats:flight2.seats,availableSeat:flight2.availableSeat}, session);
        // console.log("here3")
        // Add payment record
        const paymentRecord = {
            ...paymentInfo,
            firstFlightId: flight1Id,
            secondFlightId: flight2Id,
            seatsBusiness: vip,
            flight1Price: flight1.price,
            flight2Price: flight2 ? flight2.price : 0,
            baggageFees: Math.max(passengers.reduce((total, p) => total + p.bags, 0) - passengers.length,0) *10, // Example: $50 per bag
            total: totalPrice,
        };

        const payment = await PaymentManager.createPayment(paymentRecord, session);
        if (!payment.success) {
            throw new Error("Failed to process payment.");
        }
        // console.log(payment);
        // Sort passengers by ID
        await passengers.sort((a, b) => a.id - b.id);
        // Add passengers and emergency contacts
        const passengerRecords = [];
        let emergencyContactId = null;

        for (const [index, passenger] of passengers.entries()) {
            if (index === 0) {
                // console.log(passenger.emergencyContact)
                const emergencyContact = await EmergencyContactManager.createContact(passenger.emergencyContact, session);
                if (!emergencyContact.success) {
                    throw new Error("Failed to save emergency contact.");
                }
                emergencyContactId = emergencyContact.contact._id;
            }

            const newPassenger = { ...passenger };
            delete newPassenger.id;
            delete newPassenger.copyEmergencyContact;
            newPassenger.paymentId = payment.payment._id;

            if (passenger.copyEmergencyContact) {
                newPassenger.emergencyContact = emergencyContactId;
            }
            else {
                if (index !== 0) {
                    const emergencyContact = await EmergencyContactManager.createContact(passenger.emergencyContact, session);
                    if (!emergencyContact.success) {
                        throw new Error("Failed to save emergency contact.");
                    }
                    newPassenger.emergencyContact = emergencyContact.contact._id;
                }else{
                    newPassenger.emergencyContact = emergencyContactId;
                }

            }
            // console.log(newPassenger)
            const savedPassenger = await PassengerManager.createPassenger(newPassenger, session);
            if (!savedPassenger.success) {
                throw new Error("Failed to save passenger.");
            }
            passengerRecords.push(savedPassenger.passenger);
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Flight reserved successfully.",
                payment: payment.payment,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
