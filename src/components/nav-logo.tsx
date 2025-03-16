"use client";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";

function NavLogo() {
    const logoDark = "/assets/logo-dark.svg";
    //const logoLight = "/assets/logo-light.svg";
    const logoMobile = "/assets/logo-mobile.svg";

    const isMobile = useIsMobile();
    console.log(isMobile)
    if (isMobile) {
        return (
            <Image
                className="dark:invert"
                src={logoMobile}
                alt="Next.js logo"
                width={24}
                height={25}
                priority
            />
        );
    }
    return (
        <Image
            className="dark:invert"
            src={logoDark}
            alt="logo"
            width={153}
            height={26}
            priority
        />
    );
}

export default NavLogo;
