import React, { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export const ImageWithFallback: React.FC<Props> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-slate-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="eager"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <span className="text-[10px] font-black text-slate-400">Đang tải...</span>
        </div>
      )}
    </div>
  );
};
