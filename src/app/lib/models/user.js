import mongoose from 'mongoose';
import dbConnect from "@/app/lib/dbConnect";

// Define the schema for the User
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple nulls
        validate: {
            validator: function (value) {
                return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email format',
        },
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple nulls
        validate: {
            validator: function (value) {
                return !value || /^[0-9]{10,15}$/.test(value); // Example: phone number validation
            },
            message: 'Invalid phone number format',
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
}, { timestamps: true });

// Enforce the constraint that at least one of email or phone must be provided
UserSchema.pre('validate', function (next) {
    if (!this.email && !this.phone) {
        this.invalidate('email', 'Either email or phone must be provided');
        this.invalidate('phone', 'Either email or phone must be provided');
    }
    next();
});
await dbConnect();
// Create the model or reuse the existing one
export const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Ensure unique index on phone field allows multiple null values
async function ensureUniqueIndex() {
    await dbConnect();
    const mongoose = require('mongoose');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const usersCollectionExists = collections.some(
        (collection) => collection.name === 'users'
    );

    if (usersCollectionExists) {
        // Ensure indexes are updated to allow sparse unique constraint
        try{
            await mongoose.connection.db.collection('users').dropIndex('phone_1');
            await mongoose.connection.db.collection('users').createIndex({ phone: 1 }, { unique: true, sparse: true });
            await mongoose.connection.db.collection('users').dropIndex('email_1');
            await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
            console.log('Unique index on phone and email fields updated');
        } catch (error) {

        }

    }
}

// Call the function to ensure unique index
ensureUniqueIndex().catch((error) => console.error('Error ensuring unique index:', error));

// User management class
class UserManager {
    static async createUser(userData) {
        await dbConnect(); // Ensure database connection

        try {
            const user = new User(userData);
            await user.save();
            return { success: true, user };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    static async findUserById(userId) {
        await dbConnect();
        try {
            const user = await User.findById(userId);
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findUserByQuery(query) {
        await dbConnect(); // Ensure database connection
        try {
            const user = await User.find(query);
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updateUser(userId, updateData) {
        await dbConnect();
        try {
            const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async deleteUser(userId) {
        await dbConnect();
        try {
            await User.findByIdAndDelete(userId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default UserManager;
