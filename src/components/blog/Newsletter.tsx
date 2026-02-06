"use client";

import { newsletter } from "@/app/resources";
import { isValidEmail } from "@/app/utils/security";
import { Button, Column, Flex, Heading, Input, Mask, SmartImage, Text } from "@/once-ui/components";
import { useState } from "react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!newsletter.display) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🛡️ Sentinel: Validate email format and length before submission
    if (!isValidEmail(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(newsletter.action, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      // With no-cors, we can't check response.ok, so we assume success if no network error thrown.
      // This is standard for third-party form endpoints like ConvertKit when submitting from client-side without a proxy.
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Column
      fillWidth
      padding="xl"
      marginBottom="l"
      border="neutral-alpha-weak"
      radius="l"
      align="center"
      horizontal="center"
      position="relative"
      overflow="hidden"
      style={{ textAlign: "center" }}
    >
      <SmartImage
        priority
        src="/images/newsletter/day.png"
        alt="Night background"
        fill
        sizes="100vw"
        position="absolute"
        top="0"
        left="0"
        style={{ zIndex: 0, objectFit: "cover" }}
      />
      <Mask cursor radius={30} fill position="absolute" style={{ zIndex: 0 }}>
        <SmartImage
          priority
          src="/images/newsletter/night.png"
          alt="Day background"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </Mask>
      <Column
        position="relative"
        zIndex={1}
        align="center"
        horizontal="center"
        fillWidth
        gap="s"
        style={{ maxWidth: "var(--responsive-width-xs)" }}
      >
        <Heading
          variant="display-strong-xs"
          onBackground="neutral-strong"
          marginBottom="s"
          wrap="balance"
        >
          {newsletter.title}
        </Heading>
        <Text
          variant="body-default-l"
          onBackground="neutral-weak"
          marginBottom="l"
          wrap="balance"
        >
          {newsletter.description}
        </Text>
      </Column>

      <Flex fillWidth horizontal="center" maxWidth={30} position="relative" zIndex={1}>
        {status === "success" ? (
          <Flex
            fillWidth
            padding="l"
            radius="l"
            background="brand-weak"
            border="brand-alpha-weak"
            horizontal="center"
          >
            <Text variant="body-default-m" onBackground="brand-strong">
              Success! Check your email to confirm.
            </Text>
          </Flex>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Flex fillWidth gap="8" direction="column" mobileDirection="column">
              <Input
                id="email"
                name="email_address"
                label="Email"
                placeholder="Email"
                type="email"
                labelAsPlaceholder
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                error={status === "error"}
                errorMessage={error}
                maxLength={254}
              />
              <Button fillWidth variant="primary" size="m" disabled={status === "loading"}>
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
            </Flex>
          </form>
        )}
      </Flex>
    </Column>
  );
};
