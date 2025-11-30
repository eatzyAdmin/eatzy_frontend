import React, { useEffect } from 'react';

export default function MenuPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/menu';
    }
  }, []);

  return (
    <main className="p-8">
      <div>Redirecting to new app router /menu…</div>
    </main>
  );
}
