'use client';

export default function GlobalError(props: { error: Error; reset: () => void }) {
  void props.error;
  void props.reset;
  return null;
}