"use client"

import React, {useState} from 'react';
import classes from "./header.module.css";
import Image from "next/image";
import close from "@/assets/whiteClose.svg";
import menu from "@/assets/menu.svg";
import Link from "next/link";
import logo from "@/assets/logo.svg";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <header className={classes.header}>
            <div>
                {menuOpen ? (
                    <Image
                        className={classes.menu}
                        src={close}
                        alt="Close menu"
                        onClick={() => setMenuOpen(false)}
                        style={{filter: 'invert(1)',margin:'0 8px' ,width:'16px'}} // SVG color fix
                    />
                ) : (
                    <Image
                        className={classes.menu}
                        src={menu}
                        alt="Open menu"
                        onClick={() => {
                            setMenuOpen(true);
                        }}
                    />
                )}
                <Link href="/" className={classes.logo}>
                    <Image className={classes.logo} src={logo} alt="Tripma"/>
                </Link>
            </div>
            {menuOpen && (
                <div className={classes.dropMenu}>
                    <Link className={classes.notActive} href="/">Flights</Link>
                    <Link className={classes.notActive}
                          href="/hotels">Hotels</Link>
                    <Link className={classes.notActive}
                          href="/packages">Packages</Link>
                </div>
            )}
        </header>
    );
};

export default Header;