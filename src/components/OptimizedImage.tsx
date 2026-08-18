import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedGoogleUrl } from '../lib/imageHelper';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  lowResUrl?: string;
  highResUrl: string;
  useIntersectionObserver?: boolean;
  optimizedSize?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  lowResUrl, 
  highResUrl, 
  alt, 
  className, 
  style, 
  useIntersectionObserver = false,
  optimizedSize,
  ...props 
}) => {
  const optLowRes = lowResUrl ? getOptimizedGoogleUrl(lowResUrl, 256) : '';
  const optHighRes = getOptimizedGoogleUrl(highResUrl, optimizedSize || 800);

  const [currentSrc, setCurrentSrc] = useState(optLowRes || optHighRes);
  const [loading, setLoading] = useState(!!optLowRes && optLowRes !== optHighRes);
  const [isVisible, setIsVisible] = useState(!useIntersectionObserver);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!useIntersectionObserver) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before it appears
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [useIntersectionObserver]);

  useEffect(() => {
    if (!isVisible) return;

    if (optLowRes && optLowRes !== optHighRes) {
      const img = new Image();
      img.src = optHighRes;
      img.onload = () => {
        setCurrentSrc(optHighRes);
        setLoading(false);
      };
    } else {
        setCurrentSrc(optHighRes);
        setLoading(false);
    }
  }, [optHighRes, optLowRes, isVisible]);

  return (
    <img
      ref={imgRef}
      {...props}
      src={isVisible ? (currentSrc || undefined) : (optLowRes || undefined)}
      alt={alt}
      loading={props.loading || "lazy"}
      decoding="async"
      className={`${className} ${loading ? 'blur-sm scale-105' : 'blur-0 scale-100'} transition-all duration-700`}
      style={style}
    />
  );
};
