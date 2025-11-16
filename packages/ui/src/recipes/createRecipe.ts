type Variants = Record<string, Record<string, string>>;
type CompoundVariant = { when: Record<string, string>; classes: string };

export function createRecipe(config: {
  base?: string;
  variants?: Variants;
  defaultVariants?: Record<string, string>;
  compoundVariants?: CompoundVariant[];
}) {
  const { base = "", variants = {}, defaultVariants = {}, compoundVariants = [] } = config;

  return (options?: Record<string, string | boolean | undefined>) => {
    const opts = { ...defaultVariants, ...(options || {}) } as Record<string, string | boolean | undefined>;

    const variantClasses: string[] = [];
    for (const key of Object.keys(variants)) {
      const val = opts[key];
      if (typeof val === "string") {
        const map = variants[key] as Record<string, string> | undefined;
        const cls = map ? map[val] : undefined;
        if (cls) variantClasses.push(cls);
      }
    }

    const compoundClasses: string[] = [];
    for (const c of compoundVariants) {
      const match = Object.entries(c.when).every(([k, v]) => opts[k] === v);
      if (match) compoundClasses.push(c.classes);
    }

    return [base, ...variantClasses, ...compoundClasses]
      .filter(Boolean)
      .join(" ");
  };
}