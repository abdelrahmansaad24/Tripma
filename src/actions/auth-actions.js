"use server";

import UserManager from "@/app/lib/models/user";
import {hashUserPassword, verifyPassword} from "@/app/lib/models/hash";

import {createAuthSession} from "@/app/lib/models/auth";
import {signIn} from "next-auth/react";

export async function socialSignIn(prev, userInfo) {
    const email = userInfo.emailOrPhone;
    const password = userInfo.password;
    let phone = undefined;

    let user = await UserManager.findUserByQuery({ email });

    user = user.user[0]
    // Create user in the database
    try {
        if (!user) {
            const hashedPassword = hashUserPassword(password)
            user = await UserManager.createUser({ email :email , phone, password: hashedPassword });
            user = user.user
            console.log(user);
        }
        console.log("ssssssssssssssssssss")

        console.log(user._id || user.user._id);
        console.log("ssssssssssssssssssss")
        // console.log(user.user.get('_id'));
        // const x = JSON.stringify(user);
        const x = await createAuthSession(user.get('_id') || user.user.get('_id') );
        return { success: true, message: 'Signup successful!', x };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function socialSignOut() {
    await signIn("google")
}

export async function signup(prev, formData) {
    console.log('User signed in:', formData);
    console.log(formData.emailOrPhone);
    const emailOrPhone = formData.get('emailOrPhone');
    const password = formData.get('password');
    let errors = {};

    // Validate email or phone
    let email = undefined;
    let phone = undefined;

    if (!emailOrPhone) {
        errors.emailOrPhone = 'Email or phone number is required.';
    } else if (emailOrPhone.includes('@')) {
        // Email validation
        email = emailOrPhone;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.emailOrPhone = 'Invalid email format.';
        }
    } else {
        // Phone validation
        phone = emailOrPhone;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
        if (!phoneRegex.test(phone)) {
            errors.emailOrPhone = 'Invalid phone number format. Include country code if applicable.';
        }
    }

    // Validate password
    if (!password) {
        errors.password = 'Password is required.';
    } else if (password.trim().length < 8) {
        errors.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(password)) {
        errors.password = 'Password must include at least one uppercase letter.';
    } else if (!/[a-z]/.test(password)) {
        errors.password = 'Password must include at least one lowercase letter.';
    } else if (!/[0-9]/.test(password)) {
        errors.password = 'Password must include at least one number.';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.password = 'Password must include at least one special character.';
    }

    // Check for validation errors
    if (Object.keys(errors).length > 0) {
        return { errors: errors };
    }

    const hashedPassword = hashUserPassword(password)
    // Create user in the database
    try {
        const user = await UserManager.createUser({ email, phone, password: hashedPassword });
        const x = JSON.stringify(user);
        await createAuthSession(user.user.get('_id'));
        console.log(x)
        return { success: true, message: 'Signup successful!', x };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function signin(prev,formData) {
    // console.log(formData)
    const emailOrPhone = formData.get('emailOrPhone');
    const password = formData.get('password');
    let errors = {};

    // Validate email or phone
    let email = undefined;
    let phone = undefined;

    if (!emailOrPhone) {
        errors.emailOrPhone = 'Email or phone number is required.';
    } else if (emailOrPhone.includes('@')) {
        // Email validation
        email = emailOrPhone;
    } else {
        // Phone validation
        phone = emailOrPhone;
    }

    // Validate password
    if (!password) {
        errors.password = 'Password is required.';
    }

    // Check for validation errors
    if (Object.keys(errors).length > 0) {
        return { errors: errors };
    }

    try {
        // Find user by email or phone
        const user = email
            ? await UserManager.findUserByQuery({email: email})
            : await UserManager.findUserByQuery({phone:phone});

        if (!user) {
            return { success: false, error: 'User not found.' };
        }
        const userData = user.user[0]
        // Verify password
        if (!verifyPassword(userData.password,password)) {
            return { success: false, error: 'Invalid credentials.' };
        }

        // Create auth session
        await createAuthSession(userData.get('_id'));

        return { success: true, message: 'Signin successful!' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
