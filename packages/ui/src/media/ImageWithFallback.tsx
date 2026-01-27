"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { Utensils } from "lucide-react";

type Props = Omit<ImageProps, "onError"> & {
  containerClassName?: string;
};

export default function ImageWithFallback({ containerClassName, className, ...props }: Props) {
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

  // If no source, just return fallback
  if (!hasSrc) {
    const Fallback = (
      <div className={`flex items-center justify-center bg-gray-100 ${containerClassName ?? ""} ${isFill ? "absolute inset-0" : "w-full h-full"}`}>
        <Utensils className="w-1/3 h-1/3 text-gray-400" />
      </div>
    );

    if (isFill) return Fallback;
    // For non-fill, we try to match the expected usage by returning a div
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${containerClassName ?? ""}`} style={{ width: props.width, height: props.height }}>
        <Utensils className="w-1/3 h-1/3 text-gray-400" />
      </div>
    );
  }

  const renderContent = (applyContainerClassToFallback: boolean) => (
    <>
      <Image
        {...props}
        className={`${className} transition-opacity duration-500 ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
      {(status === "loading" || status === "error") && (
        <div
          className={`flex items-center justify-center bg-gray-100 border-[0.5px] border-gray-100 z-10 absolute inset-0 ${applyContainerClassToFallback ? (containerClassName ?? "") : ""}`}
        >
          <Utensils className="w-1/3 h-1/3 text-gray-400" />
        </div>
      )}
    </>
  );

  if (isFill) return renderContent(true);

  return (
    <div className={`relative inline-block overflow-hidden ${containerClassName ?? ""}`}>
      {renderContent(false)}
    </div>
  );
}