"use client"

import React, { useState } from 'react';
import Image from "next/image";
import close from '@/assets/cross-close-svgrepo-com.svg';
import googleIcon from "@/assets/google-icon.svg";
import appleIcon from "@/assets/apple-icon.svg";
import facebookIcon from "@/assets/facebook-icon.svg";
import separator from "@/assets/sperator.svg";
import { signup } from "@/actions/auth-actions";
import classes from "./sign-up.module.css";
import { signIn } from "next-auth/react";
function SignUp({ exit }) {
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: '',
        agreeTerms: false,
        sendDeals: false,
    });

    const [isLoading, setIsLoading] = useState(false); // For loading indicator
    const [errors, setErrors] = useState(null); // To store any validation or signup errors

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

        const response = await signup(null, new FormData(e.target));
        console.log(response)
        if (response.errors) {
            setErrors(response.errors);
        } else if (response.success) {
            exit(); // Close the modal after successful signup
        }

        setIsLoading(false);
    };

    return (
        <div className={classes.box}>
            <div className={classes.header}>
                <div className={classes.title}>
                    <h1 className={classes.h1}>Sign up for Tripma</h1>
                    <Image
                        style={{ cursor: 'pointer' }}
                        src={close}
                        alt="X"
                        onClick={exit}
                    />
                </div>
                <p className={classes.description}>
                    Tripma is totally free to use. Sign up using your email address or phone number below to get started.
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
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            required
                        />
                        I agree to the <a href="/terms" style={{ color: '#6c63ff' }}>terms and conditions</a>
                    </label>
                    <label className={classes.checkBox}>
                        <input
                            className={classes.check}
                            type="checkbox"
                            name="sendDeals"
                            checked={formData.sendDeals}
                            onChange={handleChange}
                        />
                        Send me the latest deal alerts
                    </label>
                </div>
                <button
                    className={classes.submit}
                    type="submit"
                    disabled={isLoading}
                    style={{ backgroundColor: isLoading ? '#ccc' : '' }}
                >
                    <span className={classes.submitText}>
                        {isLoading ? 'Loading...' : 'Create account'}
                    </span>
                </button>
            </form>
            {errors && (
                <p style={{ color: "red", margin: '0', padding: '0' }}>
                    {Object.values(errors).map((e) => e + ' ')}
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

export default SignUp;
