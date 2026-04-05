'use client';

import { motion, AnimatePresence } from '@repo/ui/motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface BackgroundTransitionProps {
  imageUrl: string;
  categoryName: string;
  slideUp?: boolean;
}

export default function BackgroundTransition({
  imageUrl,
  slideUp = false,
}: BackgroundTransitionProps) {
  const [currentImage, setCurrentImage] = useState(imageUrl);
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (imageUrl !== currentImage) {
      setPrevImage(currentImage);
      setCurrentImage(imageUrl);
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPrevImage(null);
      }, 1000); // Match with transition duration
      
      return () => clearTimeout(timer);
    }
  }, [imageUrl, currentImage]);

  return (
    <motion.div 
      className="fixed inset-0 -z-10 bg-[#1A1A1A] overflow-hidden" 
      animate={{ y: slideUp ? '-100vh' : 0 }} 
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={currentImage}
            alt="Background"
            fill
            priority
            quality={60}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 z-20 pointer-events-none" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      <div 
        className="absolute inset-0 z-20 pointer-events-none" 
        style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.5) 100%)'
        }} 
      />
    </motion.div>
  );
}
