import mongoose from 'mongoose';
import dbConnect from "@/app/lib/dbConnect";
import User from "./user";

// Define the schema for the Review
const ReviewSchema = new mongoose.Schema({
    profile: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Ensure userId is an ObjectId
        ref: 'User', // Reference to the User model
        required: true,
        validate: {
            validator: async function (value) {
                // Check if the userId exists in the User collection
                return !!await User.findUserById(value); // Return true if the user exists
            },
            message: 'Invalid userId: User does not exist',
        },
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    stars: {
        type: Number,
        required: true,
        min: [1, "Stars must be at least 1"],
        max: [5, "Stars cannot exceed 5"],
        validate: {
            validator: Number.isInteger,
            message: "Stars must be an integer between 1 and 5"
        }
    },
    review: {
        type: String,
        required: true,
    }
}, { timestamps: true, collection: 'reviews' });

// Create the model or reuse the existing one
const Review = mongoose.models?.Review || mongoose.model('Review', ReviewSchema);

// Review management class
class ReviewManager {
    static async createReview(ReviewData) {
        await dbConnect(); // Ensure database connection

        try {
            const review = new Review(ReviewData);
            await review.save();
            return { success: true, review: review };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    static async findReviewById(reviewId) {
        await dbConnect();
        try {
            const review = await Review.findById(reviewId);
            return { success: true, review: review };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updateReview(reviewId, updateData) {
        await dbConnect();
        try {
            const review = await Review.findByIdAndUpdate(reviewId, updateData, { new: true, runValidators: true });
            return { success: true, review: review };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async deleteReview(reviewId) { // Fixed method name
        await dbConnect();
        try {
            await Review.findByIdAndDelete(reviewId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findAllReviews() { // Method to retrieve all packages
        await dbConnect();
        try {
            const reviews = await Review.find().sort({ createdAt: 1 }); // Sort by creation time (oldest first)
            return { success: true, result: reviews };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findFirstReviews(limit) { // Method to retrieve the first given number of packages
        await dbConnect();
        try {
            const reviews = await Review.find().limit(limit); // Oldest first, limit results
            return {success: true, result: reviews};
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default ReviewManager;
