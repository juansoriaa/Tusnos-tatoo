import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedGoogleUrl } from '../lib/imageHelper';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  lowResUrl?: string;
  highResUrl: string;
  useIntersectionObserver?: boolean;
  optimizedSize?: number;
  priority?: boolean;
  deferHighRes?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  lowResUrl, 
  highResUrl, 
  alt, 
  className, 
  style, 
  useIntersectionObserver = false,
  optimizedSize,
  priority = false,
  deferHighRes = false,
  ...props 
}) => {
  const optLowRes = lowResUrl ? getOptimizedGoogleUrl(lowResUrl, 256) : '';
  const optHighRes = getOptimizedGoogleUrl(highResUrl, optimizedSize || 800);

  const [currentSrc, setCurrentSrc] = useState(optLowRes || optHighRes);
  const [loading, setLoading] = useState(!deferHighRes && !!optLowRes && optLowRes !== optHighRes);
  const [isVisible, setIsVisible] = useState(!useIntersectionObserver || priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!useIntersectionObserver || priority) {
      setIsVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px' } // Start loading 250px before it appears
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [useIntersectionObserver, priority]);

  useEffect(() => {
    if (!isVisible) return;

    if (optLowRes && optLowRes !== optHighRes) {
      let cancelled = false;
      const startUpgrade = () => {
        if (cancelled) return;
        const img = new Image();
        img.decoding = 'async';
        img.src = optHighRes;
        img.onload = () => {
          if (!cancelled) {
            setCurrentSrc(optHighRes);
            setLoading(false);
          }
        };
      };

      if (deferHighRes) {
        setCurrentSrc(optLowRes);
        setLoading(false);
        const timer = setTimeout(startUpgrade, 350);
        return () => {
          cancelled = true;
          clearTimeout(timer);
        };
      } else {
        startUpgrade();
        return () => {
          cancelled = true;
        };
      }
    } else {
      setCurrentSrc(optHighRes);
      setLoading(false);
    }
  }, [optHighRes, optLowRes, isVisible, deferHighRes]);

  return (
    <img
      ref={imgRef}
      {...props}
      src={isVisible ? (currentSrc || undefined) : (optLowRes || undefined)}
      alt={alt}
      loading={priority ? "eager" : (props.loading || "lazy")}
      fetchPriority={priority ? "high" : (useIntersectionObserver ? "low" : undefined)}
      decoding="async"
      className={`${className} ${loading ? 'blur-sm scale-105' : 'blur-0 scale-100'} transition-all duration-500`}
      style={style}
    />
  );
};
