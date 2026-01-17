"use client";

import { protectedRoutes, routes } from "@/app/resources";
import { Button, Column, Flex, Heading, Input, Spinner } from "@/once-ui/components";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface RouteGuardProps {
  /** The child components to render if authentication passes */
  children: React.ReactNode;
}

/**
 * A component that protects routes requiring authentication.
 * Checks against a list of protected routes and prompts for a password if necessary.
 */
const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const [isRouteEnabled, setIsRouteEnabled] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performChecks = async () => {
      setLoading(true);
      setIsRouteEnabled(false);
      setIsPasswordRequired(false);
      setIsAuthenticated(false);

      const checkRouteEnabled = () => {
        if (!pathname) return false;

        // Check for exact match in routes configuration
        if (pathname in routes) {
          return routes[pathname as keyof typeof routes];
        }

        // Check for dynamic routes
        const dynamicRoutes = ["/publications", "/work", "/blog"] as const;
        for (const route of dynamicRoutes) {
          if (pathname?.startsWith(route)) {
            return !!routes[route];
          }
        }

        // If route is unknown (not in config), allow it to pass through
        // so Next.js can handle 404s or other pages not explicitly managed.
        return true;
      };

      const routeEnabled = checkRouteEnabled();
      setIsRouteEnabled(routeEnabled);

      if (protectedRoutes[pathname as keyof typeof protectedRoutes]) {
        setIsPasswordRequired(true);
        const response = await fetch("/api/check-auth");
        if (response.ok) {
          setIsAuthenticated(true);
        }
      }

      setLoading(false);
    };

    performChecks();
  }, [pathname]);

  const handlePasswordSubmit = async () => {
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      setError(undefined);
    } else {
      setError("Incorrect password");
    }
  };

  if (loading) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!isRouteEnabled) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isPasswordRequired && !isAuthenticated) {
    return (
      <Column paddingY="128" maxWidth={24} gap="24" center>
        <Heading align="center" wrap="balance">
          This page is password protected
        </Heading>
        <Column fillWidth gap="8" horizontal="center">
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={error}
            maxLength={128}
          />
          <Button onClick={handlePasswordSubmit}>Submit</Button>
        </Column>
      </Column>
    );
  }

  return <>{children}</>;
};

export { RouteGuard };
