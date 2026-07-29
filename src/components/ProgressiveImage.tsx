import React, { useState, useEffect } from 'react';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  thumbnailUrl?: string;
  highResUrl: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ thumbnailUrl, highResUrl, alt, className, style, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(thumbnailUrl || highResUrl);
  const [loading, setLoading] = useState(!!thumbnailUrl && thumbnailUrl !== highResUrl);

  useEffect(() => {
    if (thumbnailUrl && thumbnailUrl !== highResUrl) {
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
  }, [highResUrl, thumbnailUrl]);

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={`${className} ${loading ? 'blur-sm' : 'blur-0'} transition-all duration-700`}
      style={style}
    />
  );
};
