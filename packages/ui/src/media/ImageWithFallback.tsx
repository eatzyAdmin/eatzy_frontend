"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { Utensils } from "lucide-react";

import verticalPlaceholder from "../assets/placeholders/vertical_placeholder.jpg";
import horizontalPlaceholder from "../assets/placeholders/horizontal_placeholder.jpg";

type Props = Omit<ImageProps, "onError"> & {
  containerClassName?: string;
  placeholderMode?: "vertical" | "horizontal";
};

export default function ImageWithFallback({ containerClassName, className, placeholderMode, ...props }: Props) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  // Use state derivation to handle src changes safely without useEffect race conditions
  const [prevSrc, setPrevSrc] = useState(props.src);

  if (props.src !== prevSrc) {
    setPrevSrc(props.src);
    setStatus("loading");
  }

  const isFill = (props as any).fill === true;

  // Validate src: must be absolute URL or start with / for next/image
  const isValidSrc = (src: any): boolean => {
    if (!src) return false;
    if (typeof src !== 'string') return true; // StaticImport is valid
    const trimmed = src.trim();
    if (trimmed === '') return false;
    return trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:');
  };

  const hasSrc = isValidSrc(props.src);

  const renderPlaceholder = (isFillMode: boolean) => {
    const containerClasses = `flex items-center justify-center bg-zinc-900 ${containerClassName ?? ""} ${isFillMode ? "absolute inset-0" : "w-full h-full"}`;

    if (placeholderMode === "vertical") {
      return (
        <div className={containerClasses} style={!isFillMode ? { width: props.width, height: props.height } : undefined}>
          <Image
            src={verticalPlaceholder}
            alt="Placeholder"
            fill
            className="object-cover opacity-40"
          />
        </div>
      );
    }

    if (placeholderMode === "horizontal") {
      return (
        <div className={containerClasses} style={!isFillMode ? { width: props.width, height: props.height } : undefined}>
          <Image
            src={horizontalPlaceholder}
            alt="Placeholder"
            fill
            className="object-cover opacity-40"
          />
        </div>
      );
    }

    return (
      <div className={containerClasses} style={!isFillMode ? { width: props.width, height: props.height } : undefined}>
        <Utensils className="w-1/3 h-1/3 text-gray-400" />
      </div>
    );
  };

  // If no source, just return fallback
  if (!hasSrc) {
    return renderPlaceholder(isFill);
  }

  const renderContent = (applyContainerClassToFallback: boolean) => (
    <>
      <Image
        {...props}
        className={`${className} transition-opacity duration-500 ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
      {(status === "loading" || status === "error") && renderPlaceholder(true)}
    </>
  );

  if (isFill) return renderContent(true);

  return (
    <div className={`relative inline-block overflow-hidden ${containerClassName ?? ""}`}>
      {renderContent(false)}
    </div>
  );
}