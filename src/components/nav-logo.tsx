"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";

function NavLogo() {
    const logoDark = "/assets/logo-dark.svg";
    const logoMobile = "/assets/logo-mobile.svg";

    const isMobile = useIsMobile();

    return (
        <div
            className={`${
                isMobile ? "w-[24px] h-[25px]" : "w-[153px] h-[26px]"
            } relative`}
        >
            {/* Base logo that's visible in light mode */}
            <div className="absolute inset-0 dark:hidden">
                <Image
                    src={isMobile ? logoMobile : logoDark}
                    alt="logo"
                    fill
                    priority
                />
            </div>

            {/* Dark mode version with custom styling */}
            <div className="absolute inset-0 hidden dark:block">
                <div
                    className="absolute inset-0 bg-white"
                    style={{
                        WebkitMaskImage: `url(${
                            isMobile ? logoMobile : logoDark
                        })`,
                        maskImage: `url(${isMobile ? logoMobile : logoDark})`,
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                    }}
                ></div>
                
                <div
                    className="absolute inset-0 bg-[oklch(0.55_0.1553_281.45)]"
                    style={{
                        WebkitMaskImage: `url(${
                            isMobile ? logoMobile : logoDark
                        })`,
                        maskImage: `url(${isMobile ? logoMobile : logoDark})`,
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        // This would need custom CSS to isolate just the stripe part
                        clipPath: isMobile
                            ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                            : "polygon(0% 0%, 25% 0%, 25% 100%, 0% 100%)",
                    }}
                ></div>
            </div>
        </div>
    );
}

export default NavLogo;
