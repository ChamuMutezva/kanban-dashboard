"use client"

import type React from "react"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Hook for simple animations
export const useGSAPAnimation = (
  elementRef: React.RefObject<HTMLElement>,
  animation: gsap.TweenVars,
  trigger?: boolean,
  delay = 0,
) => {
  useEffect(() => {
    if (!elementRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay,
        ...(trigger && {
          scrollTrigger: {
            trigger: elementRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }),
      })

      tl.from(elementRef.current, {
        ...animation,
      })
    })

    return () => ctx.revert() // Clean up animations
  }, [elementRef, animation, trigger, delay])
}

// Hook for staggered animations (for lists, grids, etc.)
export const useGSAPStaggerAnimation = (
  parentRef: React.RefObject<HTMLElement>,
  childSelector: string,
  animation: gsap.TweenVars,
  staggerAmount = 0.1,
  trigger?: boolean,
  delay = 0,
) => {
  useEffect(() => {
    if (!parentRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay,
        ...(trigger && {
          scrollTrigger: {
            trigger: parentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }),
      })

      tl.from(parentRef.current?.querySelectorAll(childSelector), {
        ...animation,
        stagger: staggerAmount,
      })
    })

    return () => ctx.revert() // Clean up animations
  }, [parentRef, childSelector, animation, staggerAmount, trigger, delay])
}

// Page transition animation
export const pageTransition = (element: HTMLElement, duration = 0.5) => {
  return gsap.fromTo(element, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration, ease: "power2.out" })
}

// Hover animation for cards
export const useCardHoverAnimation = (cardRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!cardRef.current) return

    const card = cardRef.current

    const enterAnimation = () => {
      gsap.to(card, {
        y: -5,
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        duration: 0.2,
        ease: "power2.out",
      })
    }

    const leaveAnimation = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        duration: 0.2,
        ease: "power2.out",
      })
    }

    card.addEventListener("mouseenter", enterAnimation)
    card.addEventListener("mouseleave", leaveAnimation)

    return () => {
      card.removeEventListener("mouseenter", enterAnimation)
      card.removeEventListener("mouseleave", leaveAnimation)
    }
  }, [cardRef])
}
