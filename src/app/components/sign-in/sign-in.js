"use client";

import React, { useState } from 'react';
import Image from "next/image";
import close from '@/assets/cross-close-svgrepo-com.svg';
import googleIcon from "@/assets/google-icon.svg";
import appleIcon from "@/assets/apple-icon.svg";
import facebookIcon from "@/assets/facebook-icon.svg";
import separator from "@/assets/sperator.svg";
import { signin } from "@/actions/auth-actions";
import classes from "./sign-in.module.css";
import {toast} from "react-hot-toast";
import {signIn} from "next-auth/react";

function SignIn({ exit }) {
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: '',
        rememberMe: false,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors(null);

        try {
            console.log(e.target);
            const response = await signin(null, new FormData(e.target));
            console.log(response);

            if (response.error) {
                toast.error("Invalid email or password");
                setErrors("Invalid email or password");
            } else if (response.success) {
                exit(); // Close the modal after successful signin
            }
        } catch (error) {
            setErrors({ general: "An unexpected error occurred." });
            // toast.error(errors);

            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={classes.box}>
            <div className={classes.header}>
                <div className={classes.title}>
                    <h1 className={classes.h1}>Welcome back to Tripma</h1>
                    <Image
                        style={{ cursor: 'pointer' }}
                        src={close}
                        alt="Close"
                        onClick={exit}
                    />
                </div>
                <p className={classes.description}>
                    Tripma is totally free to use. Sign in to enjoy our wonderful deals.
                </p>
            </div>
            <form className={classes.form} onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                    <input
                        className={classes.input}
                        type="text"
                        name="emailOrPhone"
                        placeholder="Email or phone number"
                        value={formData.emailOrPhone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <input
                        className={classes.input}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label className={classes.checkBox}>
                        <input
                            className={classes.check}
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        Keep me signed in
                    </label>
                </div>
                <button
                    className={classes.submit}
                    type="submit"
                    disabled={isLoading}
                    style={{ backgroundColor: isLoading ? '#ccc' : undefined }}
                >
                    <span className={classes.submitText}>
                        {isLoading ? 'Loading...' : 'Sign In'}
                    </span>
                </button>
            </form>
            {errors && (
                <p style={{ color: "red", margin: '0', padding: '0' }}>
                    {errors}
                </p>
            )}
            <div className={classes.separator}>
                <Image src={separator} alt="OR" />
            </div>
            <div className={classes.buttonsContainer}>
                <button className={classes.socialButton} onClick={() =>
                    signIn("google")
                }>
                    <Image src={googleIcon} alt="Google icon" width={20} height={20} />
                    <span>Continue with Google</span>
                </button>
                <button className={classes.socialButton}>
                    <Image src={appleIcon} alt="Apple icon" width={20} height={20} />
                    <span>Continue with Apple</span>
                </button>
                <button className={classes.socialButton} onClick={() =>
                    signIn("facebook")
                }>
                    <Image src={facebookIcon} alt="Facebook icon" width={20} height={20} />
                    <span>Continue with Facebook</span>
                </button>
            </div>
        </div>
    );
}

export default SignIn;
