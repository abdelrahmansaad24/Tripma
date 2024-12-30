// File: /src/app/api/auth/logout/route.js

import { cookies } from 'next/headers';
import lucia from '@/app/lib/models/auth';
import mongoose from 'mongoose';
import { Session } from '@/app/lib/models/auth';

async function invalidateSession(sessionId) {
    try {
        // Delete the session from the database
        await Session.findByIdAndDelete(sessionId);
    } catch (error) {
        console.error('Error invalidating session:', error);
    }
}

export async function POST() {
    const sessionCookie = (await cookies()).get(lucia.sessionCookieName);

    if (sessionCookie) {
        const sessionId = sessionCookie.value;

        try {
            // Invalidate the session in the database
            await invalidateSession(new mongoose.Types.ObjectId(sessionId));
        } catch (error) {
            console.error('Error during session invalidation:', error);
        }

        // Clear the session cookie
        const blankSessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(blankSessionCookie.name, blankSessionCookie.value, blankSessionCookie.attributes);
    }

    // Return a success response
    return Response.json({ message: 'Logged out successfully' });
}
