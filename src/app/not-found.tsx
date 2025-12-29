import { Button, Column, Heading, Text } from "@/once-ui/components";

export default function NotFound() {
  return (
    <Column as="section" fill center paddingBottom="160">
      <Text marginBottom="s" variant="display-strong-xl">
        404
      </Text>
      <Heading marginBottom="l" variant="display-default-xs">
        Page Not Found
      </Heading>
      <Text marginBottom="l" onBackground="neutral-medium">
        The page you are looking for does not exist.
      </Text>
      <Button
        href="/"
        variant="secondary"
        arrowIcon
      >
        Go Home
      </Button>
    </Column>
  );
}
