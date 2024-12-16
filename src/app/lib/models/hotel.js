import mongoose from 'mongoose';
import dbConnect from "@/app/lib/dbConnect";

// Define the schema for the Hotel
const HotelSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    des: {
        type: String,
        required: true,
    }
}, { timestamps: true, collection: 'hotels'});

// Create the model or reuse the existing one
const Hotel = mongoose.models?.Hotel || mongoose.model('Hotel', HotelSchema);

// Hotel management class
class HotelManager {
    static async createHotel(HotelData) {
        await dbConnect(); // Ensure database connection

        try {
            const hotel = new Hotel(HotelData);
            await hotel.save();
            return { success: true, hotel: hotel };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    static async findHotelById(hotelId) {
        await dbConnect();
        try {
            const hotel = await Hotel.findById(hotelId);
            return { success: true, hotel: hotel };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updateHotel(hotelId, updateData) {
        await dbConnect();
        try {
            const hotel = await Hotel.findByIdAndUpdate(hotelId, updateData, { new: true, runValidators: true });
            return { success: true, hotel: hotel };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async deleteHotel(hotelId) { // Fixed method name
        await dbConnect();
        try {
            await Hotel.findByIdAndDelete(hotelId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findAllHotels() { // Method to retrieve all packages
        await dbConnect();
        try {
            const hotels = await Hotel.find().sort({ createdAt: 1 }); // Sort by creation time (oldest first)
            return { success: true, result: hotels };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findFirstHotels(limit) { // Method to retrieve the first given number of packages
        await dbConnect();
        try {
            const hotels = await Hotel.find().limit(limit); // Oldest first, limit results
            return {success: true, result: hotels};
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default HotelManager;
