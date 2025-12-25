import { motion, HTMLMotionProps } from 'framer-motion';

export type TextShimmerProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  backgroundColor?: string;
  shimmerColor?: string;
  speed?: number;
  delay?: number;
  lines?: number;
  lineSpacing?: number;
  widthVariation?: boolean;
} & HTMLMotionProps<'div'>;

const TextShimmer = ({
  width = '100%',
  height = 20,
  className = '',
  rounded = 'md',
  backgroundColor = 'bg-gray-200',
  shimmerColor = 'bg-white/60',
  speed = 1.5,
  delay = 0,
  lines = 1,
  lineSpacing = 8,
  widthVariation = true,
  ...props
}: TextShimmerProps) => {
  // Shimmer animation variants
  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        repeat: Infinity,
        duration: speed,
        ease: 'linear',
        delay: delay
      }
    }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: delay
      }
    }
  };

  // Generate rounded class based on prop
  const getRoundedClass = () => {
    const roundedClasses = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full'
    };
    return roundedClasses[rounded] || 'rounded-md';
  };

  // Generate line widths with variation
  const getLineWidth = (lineIndex: number) => {
    if (!widthVariation) return '100%';

    // Convert width to string if it's a number for percentage calculation logic simulation
    // Since we can't easily calc % of a passed string width, we just vary logic if width is default '100%'
    if (width !== '100%') return width;

    const variations = ['100%', '85%', '92%', '78%', '95%'];
    return variations[lineIndex % variations.length];
  };

  // Convert width/height to style object
  const getStyle = () => {
    const style: React.CSSProperties = {};

    if (typeof width === 'number') {
      style.width = `${width}px`;
    } else if (typeof width === 'string') {
      style.width = width;
    }

    if (typeof height === 'number') {
      style.height = `${height}px`;
    } else if (typeof height === 'string') {
      style.height = height;
    }

    return style;
  };

  // Single line component
  const ShimmerLine = ({ lineIndex, isLast }: { lineIndex: number; isLast: boolean }) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`
        ${backgroundColor} 
        ${getRoundedClass()}
        relative overflow-hidden
        ${className}
      `}
      style={{
        ...getStyle(),
        width: getLineWidth(lineIndex),
        marginBottom: isLast ? 0 : `${lineSpacing}px`
      }}
      {...props}
    >
      <motion.div
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent`}
      />
    </motion.div>
  );

  // Multiple lines
  if (lines > 1) {
    return (
      <div className="space-y-0">
        {Array.from({ length: lines }, (_, index) => (
          <ShimmerLine
            key={index}
            lineIndex={index}
            isLast={index === lines - 1}
          />
        ))}
      </div>
    );
  }

  // Single line
  return <ShimmerLine lineIndex={0} isLast={true} />;
};

export default TextShimmer;
