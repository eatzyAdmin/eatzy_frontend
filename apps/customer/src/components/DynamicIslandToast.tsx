"use client";

import { sileo as originalSileo, Toaster as OriginalToaster } from "sileo";

export const sileo = originalSileo;

export function Toaster() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        [data-sileo-viewport] {
          z-index: 99999 !important;
        }
      `}} />
      <OriginalToaster
        position="top-center"
        theme="light"
      />
    </>
  );
}
