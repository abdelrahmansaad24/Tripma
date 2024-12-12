"use client";

import React from 'react';
import Image from "next/image";

import logo from '@/assets/logo.svg';
import menu from '@/assets/menu.svg';
import close from '@/assets/cross-close-svgrepo-com.svg';
import classes from './header.module.css';
import Link from "next/link";
import {usePathname} from "next/navigation";
import Sign from "@/app/components/sign/sign";


function Header() {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [signUp, setSignUp] = React.useState(false);
    const path = usePathname();

    const closeSignup = () => setSignUp(false);

    return (
        <div className={classes.navbar} >
            <header className={classes.header}>
                <div>
                    {menuOpen ? (
                        <Image className={classes.menu} src={close} alt={'menu'} onClick={() => setMenuOpen(false)}/>
                    ) : (
                        <Image className={classes.menu} src={menu} alt={'menu'} onClick={() => {
                            setMenuOpen(true);
                            setSignUp(false);
                        }}/>
                    )}
                    <Link href="/" className={classes.logo}>
                        <Image className={classes.logo} src={logo} alt={'Tripma'} />
                    </Link>
                </div>
                <div className={classes.buttons}>
                    <div className={classes.routs}>
                        <Link  className={path === '/' ? classes.active : classes.notActive} href="/">Flights</Link>
                        <Link className={path === '/hotels' ? classes.active : classes.notActive} href="/hotels">Hotels</Link>
                        <Link className={path === '/packages' ? classes.active : classes.notActive} href="/packages">Packages</Link>
                        <button className={classes.signIn} >Sign in</button>
                        <button className={classes.signUp} onClick={() => {
                            setMenuOpen(false);
                            setSignUp(true);
                        }}>Sign up</button>
                        {
                            signUp ? <Sign type={"signUp"} exit={closeSignup}/> : null
                        }
                    </div>
                </div>
            </header>
            {
                !signUp && menuOpen  ? <div className={classes.dropMenu}>
                    <Link className={path === '/' ? classes.active : classes.notActive} href="/">Flights</Link>
                    <Link className={path === '/hotels' ? classes.active : classes.notActive}
                          href="/hotels">Hotels</Link>
                    <Link className={path === '/packages' ? classes.active : classes.notActive}
                          href="/packages">Packages</Link>
                </div> : null
            }

        </div>
    );
}

export default Header;
