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
        try {
          const response = await fetch("/api/check-auth");
          if (response.ok) {
            const data = await response.json();
            if (data.authenticated === true) {
              setIsAuthenticated(true);
            }
          }
        } catch (error) {
          console.error("Auth check failed:", error);
        }
      }

      setLoading(false);
    };

    performChecks();
  }, [pathname]);

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success === true) {
          setIsAuthenticated(true);
          setError(undefined);
          return;
        }
      }
      setError("Incorrect password");
    } catch (error) {
      console.error("Authentication failed:", error);
      setError("An error occurred. Please try again.");
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
        <Column
          as="form"
          fillWidth
          gap="8"
          horizontal="center"
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordSubmit();
          }}
        >
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={error}
            maxLength={128}
          />
          <Button type="submit">Submit</Button>
        </Column>
      </Column>
    );
  }

  return <>{children}</>;
};

export { RouteGuard };
