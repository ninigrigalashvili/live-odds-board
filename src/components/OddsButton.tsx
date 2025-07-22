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
    const getButtonStyles = () => {
      // Highlight styles take priority
      if (highlight === "increase") {
        return {
          bg: "green.500",
          color: "white",
          border: "2px solid",
          borderColor: "green.300",
          boxShadow: "0 0 12px rgba(72, 187, 120, 0.8)",
          transform: "scale(1.05)",
          _hover: {
            bg: "green.600",
            transform: "scale(1.05)",
          },
        };
      }

      if (highlight === "decrease") {
        return {
          bg: "red.500",
          color: "white",
          border: "2px solid",
          borderColor: "red.300",
          boxShadow: "0 0 12px rgba(245, 101, 101, 0.8)",
          transform: "scale(1.05)",
          _hover: {
            bg: "red.600",
            transform: "scale(1.05)",
          },
        };
      }

      // Normal styles
      return {
        bg: isSelected ? "blue.500" : "gray.600",
        color: "white",
        border: "2px solid transparent",
        _hover: {
          bg: isSelected ? "blue.600" : "gray.500",
          transform: "scale(1.02)",
        },
        _active: {
          transform: "scale(0.98)",
        },
      };
    };

    return (
      <Button
        size={size}
        variant="solid"
        {...getButtonStyles()}
        onClick={onClick}
        transition="all 0.2s ease-in-out"
        minW="60px"
        h="50px"
      >
        <VStack gap={0}>
          <Text fontSize="10px" fontWeight="bold">
            {option.name}
          </Text>
          <Text
            fontSize="12px"
            color={highlight ? "white" : "yellow.300"}
            fontWeight={highlight ? "bold" : "normal"}
          >
            {option.value}
          </Text>
        </VStack>
      </Button>
    );
  }
);

OddsButton.displayName = "OddsButton";

export default OddsButton;
