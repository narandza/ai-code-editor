"use client";

import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { ThemeProvider } from "next-themes";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth, UserButton } from "@clerk/nextjs";

import { AuthLoadingView } from "@/features/auth/components/auth-loading-view";
import { UnauthenticatedView } from "@/features/auth/components/unauthenticated-view";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Authenticated>
            <UserButton />
            {children}
          </Authenticated>

          <Unauthenticated>
            <UnauthenticatedView />
          </Unauthenticated>

          <AuthLoading>
            <AuthLoadingView />
          </AuthLoading>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
