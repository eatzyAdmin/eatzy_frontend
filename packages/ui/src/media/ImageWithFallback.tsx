"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { Utensils } from "lucide-react";

type Props = Omit<ImageProps, "onError"> & {
  containerClassName?: string;
};

export default function ImageWithFallback({ containerClassName, className, ...props }: Props) {
  const [errored, setErrored] = useState(false);
  const isFill = (props as any).fill === true;
  const hasSrc = !!props.src;

  if (!hasSrc || errored) {
    if (isFill) {
      return (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-200 ${containerClassName ?? ""}`}>
          <Utensils className="w-1/3 h-1/3 text-gray-400" />
        </div>
      );
    }
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${containerClassName ?? ""}`}>
        <Utensils className="w-1/3 h-1/3 text-gray-400" />
      </div>
    );
  }

  return <Image {...props} className={className} onError={() => setErrored(true)} />;
}