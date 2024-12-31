import mongoose from 'mongoose';
import dbConnect from "@/app/lib/dbConnect";

// Define the schema for the Payment
const PaymentSchema = new mongoose.Schema({
    firstFlightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    secondFlightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        default: null,
        required: false,
    },
    seatsBusiness: {
        type: Number,
        required: true,
    },
    flight1Price: {
        type: Number,
        required: true,
    },
    flight2Price: {
        type: Number,
        default: 0,
    },
    baggageFees: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    nameOnCard: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: String,
        required: true,
    },
    ccv: {
        type: String,
        required: true,
    }
}, { timestamps: true, collection: 'payments' });

// Create the model or reuse the existing one
const Payment = mongoose.models?.Payment || mongoose.model('Payment', PaymentSchema);

// Payment management class
class PaymentManager {
    static async createPayment(paymentData, session = null) {
        await dbConnect(); // Ensure database connection

        try {

            const payment = new Payment(paymentData);
            if (session) {
                await payment.save({session:session}); // Save the payment with the session
            } else {
                await payment.save(); // Save without session for non-transactional use
            }
            return { success: true, payment: payment };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    static async findPaymentById(paymentId) {
        await dbConnect();
        try {
            const payment = await Payment.findById(paymentId)
                // .populate('firstFlightId secondFlightId');
            return { success: true, payment: payment };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updatePayment(paymentId, updateData) {
        await dbConnect();
        try {
            const payment = await Payment.findByIdAndUpdate(paymentId, updateData, { new: true, runValidators: true });
            return { success: true, payment: payment };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async deletePayment(paymentId) {
        await dbConnect();
        try {
            await Payment.findByIdAndDelete(paymentId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findAllPayments() {
        await dbConnect();
        try {
            const payments = await Payment.find().sort({ createdAt: 1 }); // Sort by creation time (oldest first)
            return { success: true, result: payments };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findPaymentsByQuery(query) {
        await dbConnect(); // Ensure database connection
        try {
            const payments = await Payment.find(query).populate('firstFlightId secondFlightId');
            return { success: true, result: payments };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findFirstPayments(limit) {
        await dbConnect();
        try {
            const payments = await Payment.find().limit(limit); // Oldest first, limit results
            return { success: true, result: payments };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default PaymentManager;
