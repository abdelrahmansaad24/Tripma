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
import cookies from "js-cookie";
import { useSession } from "next-auth/react";


function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [signUp, setSignUp] = useState(false);
    const [signIn, setSignIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isPromotionVisible, setIsPromotionVisible] = useState(true);
    const [margin, setMargin] = useState('64px');
    const handleProfile = () => {
        cookies.remove('auth_session');
        fetch('https://tripma-eight.vercel.app/api/user/logout', {
            method: 'POST',
        }).then((response) => {
                setUser(null);
                setIsPromotionVisible(true);
                setMargin('64px');
        }

        )

    }
    const path = usePathname();

    const session = useSession();
    useEffect(() =>{
        if (session.status === "authenticated" && session.data && session.data.user && session.data.user.id){
            console.log(session)
            cookies.set('auth_session', session.data.user.id, { path: '/' });
        }
    },[])

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('https://tripma-eight.vercel.app/api/auth/verify');
                const data = await response.json();
                data && data.session && setUser(data.session.userId);

                // Hide promotion banner if the user is logged in
                if (data && data.session) {
                    setIsPromotionVisible(false);
                    setMargin('0px');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        fetchUser();
    }, [signUp,signIn,isPromotionVisible]);

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
                                style={{filter: 'invert(1)', width:"16px"}} // SVG color fix
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
                                // style={{filter: 'invert(1)'}} // SVG color fix
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

                            {path !== '/' ? (
                                <div className={classes.user}>
                                    <Image src={profile} alt="User" width={50} onClick={handleProfile} />
                                </div>
                            ) : user ? (<div className={classes.user}>
                                <Image src={profile} alt="User" width={50} onClick={handleProfile}/>
                            </div>)
                            :(
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
