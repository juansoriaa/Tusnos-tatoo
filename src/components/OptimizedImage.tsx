import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedGoogleUrl } from '../lib/imageHelper';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  lowResUrl?: string;
  highResUrl: string;
  fallbackUrls?: (string | undefined | null)[];
  useIntersectionObserver?: boolean;
  optimizedSize?: number;
  priority?: boolean;
  deferHighRes?: boolean;
}

/**
 * Checks whether a loaded HTMLImageElement is ImgBB's 503 "service unavailable"
 * blue placeholder image (always a 180x180 PNG from i.ibb.co).
 */
function isImgBBPlaceholder(img: HTMLImageElement, src?: string): boolean {
  const checkSrc = src || img.currentSrc || img.src || '';
  if (!checkSrc.includes('ibb.co')) return false;
  return img.naturalWidth === 180 && img.naturalHeight === 180;
}

function appendWakeupParam(url: string, attempt: number): string {
  if (!url || url.startsWith('data:')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}wakeup=${attempt}_${Date.now()}`;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  lowResUrl, 
  highResUrl, 
  fallbackUrls = [],
  alt, 
  className = '', 
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
  const [isRecovering, setIsRecovering] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    retryCountRef.current = 0;
    setIsRecovering(false);
  }, [optHighRes, optLowRes]);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

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
      { rootMargin: '250px' }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [useIntersectionObserver, priority]);

  const recoverFromImgBBColdStorage = (failedUrl: string) => {
    setIsRecovering(true);
    const attempt = ++retryCountRef.current;

    // Build ordered list of candidate URLs to try (highRes, fallbacks, lowRes)
    const candidates = [
      optHighRes,
      ...fallbackUrls.filter((u): u is string => !!u && typeof u === 'string'),
      optLowRes
    ].filter(Boolean);

    const uniqueCandidates = Array.from(new Set(candidates));

    if (attempt <= 4) {
      const delayMs = attempt === 1 ? 400 : attempt * 1200;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = setTimeout(() => {
        // Pick an alternate candidate first, or wake up the primary high-res URL
        const targetBase = uniqueCandidates[(attempt - 1) % uniqueCandidates.length] || failedUrl;
        const wakeupUrl = targetBase.includes('ibb.co')
          ? appendWakeupParam(targetBase, attempt)
          : targetBase;

        const probe = new Image();
        probe.decoding = 'async';
        probe.onload = () => {
          if (!isImgBBPlaceholder(probe, wakeupUrl)) {
            setCurrentSrc(wakeupUrl);
            setIsRecovering(false);
            setLoading(false);
          } else {
            recoverFromImgBBColdStorage(targetBase);
          }
        };
        probe.onerror = () => {
          recoverFromImgBBColdStorage(targetBase);
        };
        probe.src = wakeupUrl;
      }, delayMs);
    }
  };

  useEffect(() => {
    if (!isVisible) return;

    if (optLowRes && optLowRes !== optHighRes) {
      let cancelled = false;
      const startUpgrade = () => {
        if (cancelled) return;
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          if (cancelled) return;
          if (!isImgBBPlaceholder(img, optHighRes)) {
            setCurrentSrc(optHighRes);
            setIsRecovering(false);
            setLoading(false);
          } else {
            recoverFromImgBBColdStorage(optHighRes);
          }
        };
        img.onerror = () => {
          if (!cancelled) {
            recoverFromImgBBColdStorage(optHighRes);
          }
        };
        img.src = optHighRes;
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
      onLoad={(e) => {
        if (isImgBBPlaceholder(e.currentTarget, currentSrc)) {
          recoverFromImgBBColdStorage(currentSrc || optHighRes);
          return;
        }
        setIsRecovering(false);
        if (props.onLoad) props.onLoad(e);
      }}
      onError={(e) => {
        recoverFromImgBBColdStorage(currentSrc || optHighRes);
        if (props.onError) props.onError(e);
      }}
      className={`${className} ${loading ? 'blur-sm scale-105' : 'blur-0 scale-100'} ${isRecovering ? 'opacity-0 animate-pulse bg-[#121316]' : 'opacity-100'} transition-all duration-500`}
      style={style}
    />
  );
};
