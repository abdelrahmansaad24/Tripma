import mongoose from 'mongoose';
import dbConnect from "@/app/lib/dbConnect";

// Define the schema for the Flight
const FlightSchema = new mongoose.Schema({
    logo: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        required:true,
    },
    time: {
        type: String,
        required: true,
    },
    stop: {
        type: String,
        required: true,
    },
    hnl: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    // trip: {
    //     type: String,
    //     required: true,
    // },
    departure: {
        type: String,
        required: true,
    },
    arrival: {
        type: String,
        required: true,
    },
    roundTrip: {
        type: Boolean,
        required: true,
    },
    availableVIP: {
        type: Number,
        required: true,
    },
    availableSeat: {
        type: Number,
        required: true,
    },
    seats: {
        type: Array,
        default: [],
    }
}, { timestamps: true, collection: 'flights' });

// Create the model or reuse the existing one
const Flight = mongoose.models?.Flight || mongoose.model('Flight', FlightSchema);

// Flight management class
class FlightManager {
    static async createFlight(FlightData) {
        await dbConnect(); // Ensure database connection

        try {
            const flight = new Flight(FlightData);
            await flight.save();
            return { success: true, flight: flight };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    static async findFlightById(flightId) {
        await dbConnect();
        try {
            const flight = await Flight.findById(flightId);
            return { success: true, flight: flight };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updateFlight(flightId, updateData, session) {
        await dbConnect();

        try {
            // const options = { new: true, runValidators: true }; // Options for `findByIdAndUpdate`
            // if (session) options.session = session; // Include session in the options if provided
            const flight = await Flight.findByIdAndUpdate(flightId, updateData, { session: session, new: true});
            return { success: true, flight: flight };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async deleteFlight(flightId) {
        await dbConnect();
        try {
            await Flight.findByIdAndDelete(flightId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findAllFlights() {
        await dbConnect();
        try {
            const flights = await Flight.find().sort({ createdAt: 1 }); // Sort by creation time (oldest first)
            return { success: true, result: flights };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findFlightsByQuery(query) {
        await dbConnect(); // Ensure database connection
        try {
            const flights = await Flight.find(query);
            return { success: true, result: flights };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findFirstFlights(limit) {
        await dbConnect();
        try {
            const flights = await Flight.find().limit(limit); // Oldest first, limit results
            return { success: true, result: flights };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default FlightManager;
