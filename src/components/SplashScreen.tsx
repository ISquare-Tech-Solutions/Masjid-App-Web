'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function SplashScreen({ onComplete, duration = 2500 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#fafbfb' }}
    >
      {/* Center content: logo + title + loading dots */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3">
          {/* NWK Logo */}
          <div className="relative w-[100px] h-[100px]">
            <Image
              src="/images/nwk-logo.png"
              alt="NWK Muslim Association"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Title */}
          <p
            className="text-[40px] leading-normal whitespace-nowrap"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              color: '#36394a',
            }}
          >
            NWK Muslim Association
          </p>
        </div>

        {/* Bouncing dots loading animation */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-2 h-2 rounded-full"
              style={{
                backgroundColor: '#077734',
                animation: `splashBounce 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* iSquare logo pinned at bottom */}
      <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2">
        <div className="relative w-[120px] h-[38px]">
          <Image
            src="/images/isquare-logo.png"
            alt="iSquare Tech Solutions"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <style>{`
        @keyframes splashBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
