// File: /src/app/api/auth/verify/route.js

import { cookies } from 'next/headers';
import lucia from '@/app/lib/models/auth';

export async function GET() {
    const sessionCookie = (await cookies()).get(lucia.sessionCookieName);
    if (!sessionCookie) {
        return Response.json({ user: null, session: null });
    }

    const sessionId = sessionCookie.value;
    const result = await lucia.validateSession(sessionId);

    if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    } else if (!result.session) {
        const blankSessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(blankSessionCookie.name, blankSessionCookie.value, blankSessionCookie.attributes);
    }

    return Response.json(result);
}
