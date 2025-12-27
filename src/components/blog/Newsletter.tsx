import { Button, Column, Flex, Heading, Input, Text } from "@/once-ui/components";
import { newsletter } from "@/app/resources";

export const Newsletter = () => {
    if (!newsletter.display) return null;

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
                <form
                    action={newsletter.action}
                    method="post"
                    style={{ width: "100%", display: "flex", justifyContent: "center" }}
                >
                    <Flex fillWidth gap="8" direction="column" mobileDirection="column">
                        <Input
                            id="email"
                            label="Email"
                            placeholder="Email"
                            type="email"
                            labelAsPlaceholder
                        />
                        <Button fillWidth variant="primary" size="m">
                            Subscribe
                        </Button>
                    </Flex>
                </form>
            </Flex>
        </Column>
    );
};
