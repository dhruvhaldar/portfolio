"use client";

import { Flex, Heading, Select, Text } from "@/once-ui/components";
import { useState } from "react";

export const dynamic = 'force-static';

export default function SelectTestPage() {
  const [selected, setSelected] = useState("");
  const options = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
    { label: "Option 3", value: "opt3" },
  ];

  return (
    <Flex
      fillWidth
      fillHeight
      padding="32"
      direction="column"
      gap="16"
      vertical="center"
      horizontal="center"
    >
      <Heading variant="display-default-s">Select Component Test</Heading>
      <Text>Testing the select component integration.</Text>

      <Flex width="32">
        <Select
          id="test-select"
          label="Test Select"
          options={options}
          value={selected}
          onSelect={setSelected}
        />
      </Flex>
    </Flex>
  );
}
