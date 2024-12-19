'use client';

import React, { useEffect, useState } from 'react';
import Image from "next/image";

import logo from '@/assets/logo.svg';
import menu from '@/assets/menu.svg';
import close from '@/assets/whiteClose.svg';
import classes from './header.module.css';
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignUp from "@/app/components/sign-up/sign-up";
import SignIn from "@/app/components/sign-in/sign-in";
import profile from "@/assets/user.jpg";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [signUp, setSignUp] = useState(false);
    const [signIn, setSignIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isPromotionVisible, setIsPromotionVisible] = useState(true);
    const [margin, setMargin] = useState('64px');

    const path = usePathname();

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('/api/auth/verify');
                const data = await response.json();
                setUser(data.user);

                // Hide promotion banner if the user is logged in
                if (data.user) {
                    setIsPromotionVisible(false);
                    setMargin('0px');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        fetchUser();
    }, []);

    const closeSignup = () => setSignUp(false);
    const closeSignin = () => setSignIn(false);

    const closePromotion = () => {
        setIsPromotionVisible(false);
        setMargin('0px');
    };

    return (
        <>
            {/* Promotion Banner */}
            {isPromotionVisible && (
                <div className={classes.promotion}>
                    <span className={classes.text}>
                        Join Tripma today and save up to 20% on your flight using code TRAVEL at checkout. Promotion valid for new users only.
                    </span>
                    <Image
                        className={classes.close}
                        src={close}
                        alt="Close"
                        onClick={closePromotion}
                    />
                </div>
            )}
            <div className={classes.navbar} style={{marginTop: margin}}>


                {/* Header */}
                <header className={classes.header}>
                    <div>
                        {menuOpen ? (
                            <Image
                                className={classes.menu}
                                src={close}
                                alt="Close menu"
                                onClick={() => setMenuOpen(false)}
                                style={{filter: 'invert(1)'}} // SVG color fix
                            />
                        ) : (
                            <Image
                                className={classes.menu}
                                src={menu}
                                alt="Open menu"
                                onClick={() => {
                                    setMenuOpen(true);
                                    setSignUp(false);
                                    setSignIn(false);
                                }}
                                style={{filter: 'invert(1)'}} // SVG color fix
                            />
                        )}
                        <Link href="/" className={classes.logo}>
                            <Image className={classes.logo} src={logo} alt="Tripma"/>
                        </Link>
                    </div>
                    <div className={classes.buttons}>
                        <div className={classes.routs}>
                            <Link className={path === '/' ? classes.active : classes.notActive} href="/">Flights</Link>
                            <Link className={path === '/hotels' ? classes.active : classes.notActive}
                                  href="/hotels">Hotels</Link>
                            <Link className={path === '/packages' ? classes.active : classes.notActive}
                                  href="/packages">Packages</Link>

                            {user ? (
                                <div className={classes.user}>
                                    <Image src={profile} alt="User" width={50}/>
                                </div>
                            ) : (
                                <>
                                    <button
                                        className={classes.signIn}
                                        onClick={() => {
                                            setSignIn(true);
                                            setSignUp(false);
                                        }}
                                    >
                                        Sign in
                                    </button>
                                    {signIn && <SignIn exit={closeSignin}/>}
                                    <button
                                        className={classes.signUp}
                                        onClick={() => {
                                            setSignUp(true);
                                            setSignIn(false);
                                        }}
                                    >
                                        Sign up
                                    </button>
                                    {signUp && <SignUp exit={closeSignup}/>}
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Dropdown Menu */}
                {!signUp && menuOpen && (
                    <div className={classes.dropMenu}>
                        <Link className={path === '/' ? classes.active : classes.notActive} href="/">Flights</Link>
                        <Link className={path === '/hotels' ? classes.active : classes.notActive}
                              href="/hotels">Hotels</Link>
                        <Link className={path === '/packages' ? classes.active : classes.notActive}
                              href="/packages">Packages</Link>
                    </div>
                )}
            </div>
        </>

    );
}

export default Header;
