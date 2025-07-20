import { Button, Text, VStack } from "@chakra-ui/react";
import { memo } from "react";
import type { BettingOption } from "@/utils/constants";

interface OddsButtonProps {
  option: BettingOption;
  isSelected: boolean;
  onClick: () => void;
  highlight?: "increase" | "decrease";
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const OddsButton = memo<OddsButtonProps>(
  ({ option, isSelected, onClick, highlight, size = "sm" }) => {
    const getHighlightColor = () => {
      if (highlight === "increase") return "green.400";
      if (highlight === "decrease") return "red.400";
      return "transparent";
    };

    const getButtonColor = () => {
      if (isSelected) return "blue.500";
      return "gray.600";
    };

    return (
      <Button
        size={size}
        variant="solid"
        bg={getButtonColor()}
        color="white"
        border="2px solid"
        borderColor={getHighlightColor()}
        _hover={{
          bg: isSelected ? "blue.600" : "gray.500",
          transform: "scale(1.05)",
        }}
        _active={{
          transform: "scale(0.95)",
        }}
        onClick={onClick}
        transition="all 0.2s"
        minW="60px"
        h="50px"
      >
        <VStack gap={0}>
          <Text fontSize="10px" fontWeight="bold">
            {option.name}
          </Text>
          <Text fontSize="12px" color="yellow.300">
            {option.value}
          </Text>
        </VStack>
      </Button>
    );
  }
);

OddsButton.displayName = "OddsButton";

export default OddsButton;
