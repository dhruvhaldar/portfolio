"use client";

import { usePathname } from "next/navigation";
import { Flex, Line, ToggleButton } from "@/once-ui/components";
import styles from "@/components/Header.module.scss";
import { routes } from "@/app/resources";
import { home, about, work, publications, gallery } from "@/app/resources/content";
import { ThemeToggle } from "./ThemeToggle";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({}) => {
  return <div>{}</div>;
};

export default TimeDisplay;

export const Header = () => {
  const pathname = usePathname() ?? "";

  return (
    <header className={styles.position}>
      <Flex
        fitHeight
        className={styles.headerContainer}
        as="div"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        style={{ minHeight: "64px" }}
      >
        <Flex 
          fillWidth 
          horizontal="center"
          style={{ maxWidth: "1200px", width: "100%" }}
        >
          <Flex
            background="surface"
            border="neutral-medium"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            style={{ minWidth: "fit-content" }}
          >
            <Flex 
              gap="4" 
              vertical="center" 
              textVariant="body-default-s"
              style={{ minWidth: "fit-content" }}
            >
              {routes["/"] && (
                <ToggleButton
                  prefixIcon="home"
                  href="/"
                  label={home.label}
                  selected={pathname === "/"}
                />
              )}
              <Line vert maxHeight="24" />
              {routes["/about"] && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="person"
                    href="/about"
                    label={about.label}
                    selected={pathname === "/about"}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="person"
                    href="/about"
                    selected={pathname === "/about"}
                  />
                </>
              )}
              {routes["/work"] && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="grid"
                    href="/work"
                    label={work.label}
                    selected={pathname.startsWith("/work")}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="grid"
                    href="/work"
                    selected={pathname.startsWith("/work")}
                  />
                </>
              )}
              {routes["/publications"] && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="article"
                    href="/publications"
                    label={publications.label}
                    selected={pathname.startsWith("/publications")}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="article"
                    href="/publications"
                    selected={pathname.startsWith("/publications")}
                  />
                </>
              )}
             {routes["/gallery"] && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="gallery"
                    href="/gallery"
                    label={gallery.label}
                    selected={pathname.startsWith("/gallery")}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="gallery"
                    href="/gallery"
                    selected={pathname.startsWith("/gallery")}
                  />
                </>
              )}
              <Line vert maxHeight="24" />
              {/* Theme Toggle */}
              <div style={{ display: 'flex', gap: '0rem', alignItems: 'center' }}>
                <div style={{ width: '0px', height: '24px', backgroundColor: 'rgba(0,0,0,0.1)' }} />
                <ThemeToggle />
              </div>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </header>
  );
};