"use client"

import gsap from "gsap"

export const createDragAnimation = (element: HTMLElement) => {
  // Save the original transform
  const originalTransform = gsap.getProperty(element, "transform")

  // Scale up slightly and add shadow when dragging starts
  const onDragStart = () => {
    gsap.to(element, {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      zIndex: 50,
      duration: 0.2,
      ease: "power2.out",
    })
  }

  // Return to normal when dragging ends
  const onDragEnd = () => {
    gsap.to(element, {
      scale: 1,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
      zIndex: 1,
      duration: 0.2,
      ease: "power2.out",
      clearProps: "zIndex", // Clear the zIndex after animation
    })
  }

  return {
    onDragStart,
    onDragEnd,
  }
}

// Animation for when a card is dropped into a new column
export const animateCardDrop = (element: HTMLElement, onComplete?: () => void) => {
  gsap.fromTo(
    element,
    { scale: 1.05 },
    {
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.5)",
      onComplete,
    },
  )

  // Flash effect to highlight the card
  gsap.fromTo(
    element,
    { backgroundColor: "rgba(var(--primary-rgb), 0.15)" },
    {
      backgroundColor: "rgba(var(--primary-rgb), 0)",
      duration: 0.5,
      ease: "power2.out",
    },
  )
}
