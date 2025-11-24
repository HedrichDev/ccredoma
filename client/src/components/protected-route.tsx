import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getCurrentUser, type AuthUser } from "../lib/auth";
import { DashboardLayout } from "./dashboard-layout";
import { Skeleton } from "./ui/skeleton";
import type { RolNombre } from "@shared/schema";

interface ProtectedRouteProps {
  component: React.ElementType;
  requiredRol: RolNombre;
}

export function ProtectedRoute({
  component: Component,
  requiredRol,
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<AuthUser | null>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false, // Do not retry on failure, just redirect
  });

  React.useEffect(() => {
    if (!isLoading && (isError || !user)) {
      setLocation("/login");
    }
  }, [isLoading, isError, user, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-md p-8 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      </div>
    );
  }

  if (!user) {
    // The useEffect above will handle the redirect, but we return null to prevent rendering children.
    return null;
  }

  if (user.rol !== requiredRol) {
    // Optional: You could render a dedicated "Unauthorized" component
    // For now, redirecting to a safe page.
    setLocation("/");
    return null;
  }

  return (
    <DashboardLayout requiredRol={requiredRol}>
      <Component />
    </DashboardLayout>
  );
}
