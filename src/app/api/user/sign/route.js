import dbConnect from "@/app/lib/dbConnect";
import {socialSignIn} from "@/actions/auth-actions";

export async function POST(req) {
    await dbConnect();
    try {
        // Parse the request body as JSON
        const body = await req.json();

        // Assume the body contains an email property
        const {id, email } = body;

        if (!email) {
            throw new Error("Email is required");
        }
        const res = await socialSignIn(null, {emailOrPhone: email, password: id});
        return new Response(
            JSON.stringify({ success: true, result: res.x.session }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error in POST handler:", error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
