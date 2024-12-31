import mongoose from 'mongoose';
import dbConnect from "@/app/lib/dbConnect";

// Define the schema for Emergency Contact
const EmergencyContactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
}, { timestamps: true, collection: 'emergency_contacts' });

// Create the model or reuse the existing one
const EmergencyContact = mongoose.models?.EmergencyContact || mongoose.model('EmergencyContact', EmergencyContactSchema);

// Emergency Contact management class
class EmergencyContactManager {
    static async createContact(contactData, session = null) {
        await dbConnect(); // Ensure database connection

        try {
            const contact = new EmergencyContact(contactData);
            if (session) {
                await contact.save({session:session}); // Save the payment with the session
            } else {
                await contact.save(); // Save without session for non-transactional use
            }
            return { success: true, contact: contact };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    static async findContactById(contactId) {
        await dbConnect();
        try {
            const contact = await EmergencyContact.findById(contactId);
            return { success: true, contact: contact };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updateContact(contactId, updateData) {
        await dbConnect();
        try {
            const contact = await EmergencyContact.findByIdAndUpdate(contactId, updateData, { new: true, runValidators: true });
            return { success: true, contact: contact };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async deleteContact(contactId) {
        await dbConnect();
        try {
            await EmergencyContact.findByIdAndDelete(contactId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findAllContacts() {
        await dbConnect();
        try {
            const contacts = await EmergencyContact.find().sort({ createdAt: 1 }); // Sort by creation time (oldest first)
            return { success: true, result: contacts };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async findContactsByQuery(query) {
        await dbConnect(); // Ensure database connection
        try {
            const contacts = await EmergencyContact.find(query);
            return { success: true, result: contacts };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default EmergencyContactManager;
