"use client";
import { usePathname } from "next/navigation";
//import { useEffect, useState } from "react";

import { Flex, Line, ToggleButton } from "@/once-ui/components";import styles from "@/components/Header.module.scss";

import { routes } from "@/app/resources";import { home, about, work, publications } from "@/app/resources/content"; // Removed gallery

type TimeDisplayProps = {timeZone: string;locale?: string;};
const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
  return (<div>{/* Implement your time display logic here */}</div>);
};export default TimeDisplay;

export const Header = () => {
  const pathname = usePathname() ?? "";

  return (
    <>
      <Flex
        fitHeight
        className={styles.position} 
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
      >
        <Flex fillWidth horizontal="center">
          <Flex background="surface" border="neutral-medium" radius="m-4" shadow="l" padding="4" horizontal="center">
            <Flex gap="4" vertical="center" textVariant="body-default-s">
              {routes["/"] && (<ToggleButton prefixIcon="home" href="/" label={home.label} selected={pathname === "/"} />)}
              <Line vert maxHeight="24" />
              {routes["/about"] && (
                <><ToggleButton className="s-flex-hide" prefixIcon="person" href="/about" label={about.label} selected={pathname === "/about"}/><ToggleButton className="s-flex-show" prefixIcon="person" href="/about" selected={pathname === "/about"}/></>
              )}
              {routes["/work"] && (
                <><ToggleButton className="s-flex-hide" prefixIcon="grid" href="/work" label={work.label} selected={pathname.startsWith("/work")}/>
                  <ToggleButton className="s-flex-show" prefixIcon="grid" href="/work" selected={pathname.startsWith("/work")}/></>
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
              {/* Removed Gallery section */}
            </Flex></Flex></Flex></Flex></>);};
