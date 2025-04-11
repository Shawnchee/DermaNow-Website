"use client";

import { MoonPayProvider } from "@moonpay/moonpay-react";

export default function MoonPayWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MoonPayProvider apiKey="pk_test_btRXA5FkjcYPIEyTphQBgEKS5rfBaupA" debug>
      {children}
    </MoonPayProvider>
  );
}