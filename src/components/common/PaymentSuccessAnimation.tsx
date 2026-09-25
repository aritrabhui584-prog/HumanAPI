import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import paymentSuccessData from "../../assets/animations/payment-success.json";

interface PaymentSuccessAnimationProps {
  onComplete?: () => void;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
}

/**
 * PaymentSuccessAnimation
 * 
 * Isolated Lottie component rendering the canonical payment-success animation
 * from `src/assets/animations/payment-success.json`.
 * 
 * Plays ONLY when a payment is fully verified and confirmed.
 */
export const PaymentSuccessAnimation: React.FC<PaymentSuccessAnimationProps> = ({
  onComplete,
  className = "w-44 h-44 sm:w-52 sm:h-52 mx-auto pointer-events-none",
  autoplay = true,
  loop = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay,
      animationData: paymentSuccessData
    });

    const handleComplete = () => {
      if (onComplete) {
        onComplete();
      }
    };

    anim.addEventListener("complete", handleComplete);

    return () => {
      anim.removeEventListener("complete", handleComplete);
      anim.destroy();
    };
  }, [autoplay, loop, onComplete]);

  return <div ref={containerRef} className={className} aria-label="Payment Success Animation" />;
};

export default PaymentSuccessAnimation;
