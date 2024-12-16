"use server"
// lib/dbConnect.js
import mongoose from 'mongoose';
import {console} from "next/dist/compiled/@edge-runtime/primitives";
// import { loadEnvConfig } from '@next/env'

// const MONGO_URI = process.env.MONGO_URI;
//
// if (!MONGO_URI) {
//     throw new Error('Please define the MONGO_URI environment variable inside .env.local');
// }
//
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect("mongodb+srv://abdelrhmanibrahimsaad1:KIDDHudmlTWfaghc@cluster0.4obp3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", opts).then((mongoose) => {
            console.log('Database connected');
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
