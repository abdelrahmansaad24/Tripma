import mongoose from 'mongoose';
import dbConnect from "@/app/lib/dbConnect";

// Define the schema for Passenger
const PassengerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        default: null,
    },
    suffix: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        default: null,
    },
    firstFlightSeat: {
        type: Number,
        required: true,
    },
    secondFlightSeat: {
        type: Number,
        required: false,
    },
    emergencyContact: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    redressNumber: {
        type: String,
        default: null,
    },
    knownTravellerNumber: {
        type: String,
        default: null,
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
}, { timestamps: true, collection: 'passengers' });

// Create the model or reuse the existing one
const Passenger = mongoose.models?.Passenger || mongoose.model('Passenger', PassengerSchema);

// Passenger management class
class PassengerManager {
    static async createPassenger(passengerData, session = null) {
        await dbConnect(); // Ensure database connection

        try {
            const passenger = new Passenger(passengerData);
            if (session) {
                await passenger.save({ session: session }); // Save the payment with the session
            } else {
                await passenger.save(); // Save without session for non-transactional use
            }
            return { success: true, passenger: passenger };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    static async findPassengerById(passengerId) {
        await dbConnect();
        try {
            const passenger = await Passenger.findById(passengerId);
            return { success: true, passenger: passenger };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updatePassenger(passengerId, updateData) {
        await dbConnect();
        try {
            const passenger = await Passenger.findByIdAndUpdate(passengerId, updateData, { new: true, runValidators: true });
            return { success: true, passenger: passenger };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async deletePassenger(passengerId) {
        await dbConnect();
        try {
            await Passenger.findByIdAndDelete(passengerId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findAllPassengers() {
        await dbConnect();
        try {
            const passengers = await Passenger.find().sort({ createdAt: 1 }); // Sort by creation time (oldest first)
            return { success: true, result: passengers };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findPassengersByQuery(query) {
        await dbConnect(); // Ensure database connection
        try {
            const passengers = await Passenger.find(query);
            return { success: true, result: passengers };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default PassengerManager;
