import { Lucia } from 'lucia';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import dbConnect from '@/app/lib/dbConnect';
import process from 'process';
import { cookies } from 'next/headers';
import mongoose, {Collection} from 'mongoose';

// Define the schema for the Session
const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true }
});

// Create the model or reuse the existing one
const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

// Function to create session table if it doesn't exist
async function createSessionTable() {
    await dbConnect();
    const collections = await mongoose.connection.db.listCollections().toArray();
    const sessionCollectionExists = collections.some(collection => collection.name === 'sessions');
    if (!sessionCollectionExists) {
        await Session.createCollection();
        console.log('Session table created');
    } else {
        console.log('Session table already exists');
    }
}

// Initialize MongoDB Adapter and Lucia
async function initializeLucia() {
    const db = await dbConnect();
    const collections = await mongoose.connection.db.collections();
    const User = collections.find(collection => collection.collectionName === 'users');
    const Session = collections.find(collection => collection.collectionName === 'sessions');
    const adapter = new MongodbAdapter(Session, User);

    const lucia = new Lucia(adapter, {
        sessionCookie: {
            expires: false,
            attributes: { secure: process.env.NODE_ENV === 'production' }
        }
    });
    try {
        await createSessionTable().catch(error => console.error('Error creating session table:', error));
    } catch (e) {
        console.error(e);
    }
    return lucia;
}

const lucia = await initializeLucia();

export async function createAuthSession(userId) {
    const lucia = await initializeLucia();
    try {
        const session = await lucia.createSession(userId, {});

        const sessionCookie = await lucia.createSessionCookie(session.id.toString());
        console.log(sessionCookie.name);
        (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        const plainSession = JSON.parse(JSON.stringify(session)); // Pass the plain object to the client component
        return { success: true, session: plainSession };
    } catch (error) {
        console.error('Error creating auth session:', error);
    }
}

export async function verifyAuth() {
    const sessionCookie = (await cookies()).get(lucia.sessionCookieName);

    if (!sessionCookie){
        return{
            user:null,
            session:null
        };
    }
    const sessionId = sessionCookie.value;

    if (!sessionId){
        return {
            user:null,
            session:null
        }
    }

    const result = await lucia.validateSession(sessionId);
    try {
        if (result.session && result.session.fresh){
            const sessionCookie = lucia.createSessionCookie(result.session.id);
            (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
        if(!result.session){
            const sessionCookie = lucia.createSessionCookie(result.session.id);
            (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
    } catch (e){

    }
    return result;
}

export default lucia;
