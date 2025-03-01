"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ClientQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create the QueryClient on the client side using useState
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
