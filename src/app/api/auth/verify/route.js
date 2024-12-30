// File: /src/app/api/auth/verify/route.js

import { cookies } from 'next/headers';
import lucia from '@/app/lib/models/auth';
import mongoose from 'mongoose';
import { Session } from "@/app/lib/models/auth"
async function validateSession(sessionId) {
    try { // Find the session by ID
        const session = await Session.findById(sessionId);
        // Check if the session exists
        if (!session) {
            return { session: null, error: 'Session not found' };
        }
        // Check if the session is fresh (you can define your own criteria for freshness)
        const isFresh = (new Date() - session.expiresAt) < 0;
        // Return the session details
        return {session: { id: session._id, userId: session.userId, expiresAt: session.expiresAt, fresh: isFresh }, error: null };
    } catch (error) {
        console.error('Error validating session:', error);
        return { session: null, error: 'Error validating session' };
    }
}


export async function GET() {
    const sessionCookie = (await cookies()).get(lucia.sessionCookieName);
    if (!sessionCookie) {
        return Response.json({ user: null, session: null });
    }

    const sessionId = sessionCookie.value;
    //console.log(`Session ID: ${sessionId}`);
    const result = await validateSession(new mongoose.Types.ObjectId(sessionId));
    console.log(result);
    if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    } else if (!result.session) {
        const blankSessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(blankSessionCookie.name, blankSessionCookie.value, blankSessionCookie.attributes);
    }

    return Response.json(result);
}


