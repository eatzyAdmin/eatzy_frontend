import React from "react";
import { motion } from "framer-motion";

export type SkeletonProps = { isLoading?: boolean; width?: string; height?: string; rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'; className?: string; children?: React.ReactNode; delay?: number };

const Skeleton = ({ isLoading = true, width = 'w-full', height = 'h-4', rounded = 'md', className = '', children, delay = 0, ...props }: SkeletonProps & Record<string, any>) => {
  const shimmerVariants = { initial: { x: '-100%' }, animate: { x: '100%', transition: { repeat: Infinity, duration: 1.5, ease: 'linear', delay } } };
  if (isLoading) {
    return (
      <div className={`relative bg-gray-200 ${width} ${height} rounded-${rounded} overflow-hidden ${className}`} {...props}>
        <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
    );
  }
  return <>{children}</>;
};

export type SkeletonGroupProps = { count?: number; isLoading?: boolean; spacing?: string; children?: React.ReactNode; itemProps?: Partial<SkeletonProps> } & Record<string, any>;

export const SkeletonGroup = ({ count = 3, isLoading = true, spacing = 'space-y-3', children, itemProps = {}, ...props }: SkeletonGroupProps) => {
  if (isLoading) {
    return (
      <div className={spacing} {...props}>
        {Array.from({ length: count }, (_, index) => (<Skeleton key={index} delay={index * 0.1} {...itemProps as any} />))}
      </div>
    );
  }
  return <>{children}</>;
};

export const SkeletonText = ({ lines = 1, isLoading = true, children, ...props }: { lines?: number; isLoading?: boolean; children?: React.ReactNode } & Partial<SkeletonProps>) => {
  if (lines === 1) return <Skeleton isLoading={isLoading} {...props}>{children}</Skeleton>;
  return (
    <SkeletonGroup count={lines} isLoading={isLoading} itemProps={{ height: 'h-4', ...(props as any) }}>{children}</SkeletonGroup>
  );
};

export const SkeletonCard = ({ isLoading = true, children, ...props }: Partial<SkeletonProps>) => (
  <Skeleton isLoading={isLoading} width="w-full" height="h-32" rounded="3xl" {...(props as any)}>{children}</Skeleton>
);

export const SkeletonAvatar = ({ size = 'md', isLoading = true, children, ...props }: { size?: 'sm' | 'md' | 'lg' | 'xl'; isLoading?: boolean; children?: React.ReactNode } & Partial<SkeletonProps>) => {
  const sizeClasses: Record<string, string> = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', xl: 'w-20 h-20' };
  return (
    <Skeleton isLoading={isLoading} width={sizeClasses[size]} height={sizeClasses[size]} rounded="full" {...(props as any)}>{children}</Skeleton>
  );
};

export const SkeletonButton = ({ isLoading = true, children, ...props }: Partial<SkeletonProps>) => (
  <Skeleton isLoading={isLoading} width="w-24" height="h-10" rounded="lg" {...(props as any)}>{children}</Skeleton>
);

export default Skeleton;