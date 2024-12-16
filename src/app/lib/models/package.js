import mongoose from 'mongoose';
import dbConnect from "@/app/lib/dbConnect";

// Define the schema for the Package
const PackageSchema = new mongoose.Schema({
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
    price: {
        type: Number, // Corrected type from Integer32 to Number
        required: true,
    },
    des: {
        type: String,
        required: true,
    }
}, { timestamps: true, collection: 'packages' });

// Create the model or reuse the existing one
const Package = mongoose.models?.Package || mongoose.model('Package', PackageSchema);

// Package management class
class PackageManager {
    static async createPackage(packageData) {
        await dbConnect(); // Ensure database connection

        try {
            const pack = new Package(packageData);
            await pack.save();
            return { success: true, pack };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    static async findPackageById(packageId) {
        await dbConnect();
        try {
            const pack = await Package.findById(packageId);
            return { success: true, pack };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updatePackage(packageId, updateData) {
        await dbConnect();
        try {
            const pack = await Package.findByIdAndUpdate(packageId, updateData, { new: true, runValidators: true });
            return { success: true, pack };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async deletePackage(packageId) { // Fixed method name
        await dbConnect();
        try {
            await Package.findByIdAndDelete(packageId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findAllPackages() { // Method to retrieve all packages
        await dbConnect();
        try {
            const packages = await Package.find().sort({ createdAt: 1 }); // Sort by creation time (oldest first)
            return { success: true,result: packages };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findFirstPackages(limit) { // Method to retrieve the first given number of packages
        await dbConnect();
        try {
            const packages = await Package.find().limit(limit); // Oldest first, limit results
            return {success: true, result: packages};
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default PackageManager;
