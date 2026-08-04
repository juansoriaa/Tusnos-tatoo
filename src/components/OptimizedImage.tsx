import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  lowResUrl?: string;
  highResUrl: string;
  useIntersectionObserver?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  lowResUrl, 
  highResUrl, 
  alt, 
  className, 
  style, 
  useIntersectionObserver = false,
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState(lowResUrl || highResUrl);
  const [loading, setLoading] = useState(!!lowResUrl && lowResUrl !== highResUrl);
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

    if (lowResUrl && lowResUrl !== highResUrl) {
      const img = new Image();
      img.src = highResUrl;
      img.onload = () => {
        setCurrentSrc(highResUrl);
        setLoading(false);
      };
    } else {
        setCurrentSrc(highResUrl);
        setLoading(false);
    }
  }, [highResUrl, lowResUrl, isVisible]);

  return (
    <img
      ref={imgRef}
      {...props}
      src={isVisible ? (currentSrc || undefined) : (lowResUrl || undefined)}
      alt={alt}
      loading={props.loading || "lazy"}
      decoding="async"
      className={`${className} ${loading ? 'blur-sm scale-105' : 'blur-0 scale-100'} transition-all duration-700`}
      style={style}
    />
  );
};
