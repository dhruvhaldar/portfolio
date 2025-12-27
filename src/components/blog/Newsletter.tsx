"use client";

import { Button, Column, Flex, Heading, Input, Text } from "@/once-ui/components";
import { useState } from "react";
import { newsletter } from "@/app/resources";

export const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [error, setError] = useState<string | null>(null);

    if (!newsletter.display) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
            background="surface"
            align="center"
            horizontal="center"
            style={{ textAlign: "center" }}
        >
            <Column
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

            <Flex fillWidth horizontal="center" maxWidth={30}>
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
                            />
                            <Button
                                fillWidth
                                variant="primary"
                                size="m"
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? "Subscribing..." : "Subscribe"}
                            </Button>
                        </Flex>
                    </form>
                )}
            </Flex>
        </Column>
    );
};
