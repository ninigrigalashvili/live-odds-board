import {
  Box,
  Flex,
  Text,
  Badge,
  HStack,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { memo } from "react";
import type { CSSProperties } from "react";
import OddsButton from "@/components/OddsButton";
import type { Match } from "@/utils/constants";

interface MatchRowProps {
  match: Match;
  selectedOdds: string[];
  onOddsSelect: (oddsId: string) => void;
  highlights: Record<string, "increase" | "decrease">;
  style: CSSProperties;
}

const MatchRow = memo<MatchRowProps>(
  ({ match, selectedOdds, onOddsSelect, highlights, style }) => {
    const isMatchLive = match.isLive;

    return (
      <Box style={style}>
        <Flex
          p={3}
          bg={isMatchLive ? "gray.800" : "gray.850"}
          borderBottom="1px"
          borderColor="gray.700"
          align="center"
          _hover={{ bg: "gray.750" }}
          transition="background-color 0.2s"
        >
          {/* Sport Icon & Info */}
          <VStack align="start" gap={1} minW="200px">
            <HStack>
              <Text fontSize="18px">{match.sportConfig.icon}</Text>
              <Text fontSize="xs" color="gray.400">
                {match.league}
              </Text>
              {isMatchLive && (
                <Badge colorPalette="red" size="sm">
                  LIVE
                </Badge>
              )}
            </HStack>
            <Text fontSize="sm" fontWeight="bold">
              {match.team1} vs {match.team2}
            </Text>
          </VStack>

          {/* Match Time & Score */}
          <VStack align="center" gap={1} minW="80px">
            <Text fontSize="xs" color="gray.400">
              {match.startTime}
            </Text>
            <Text fontSize="sm" fontWeight="bold" color="yellow.300">
              {match.score}
            </Text>
          </VStack>

          <Spacer />

          {/* Betting Options */}
          <HStack gap={2}>
            {Object.entries(match.bettingOptions).map(([category, options]) => (
              <VStack key={category} gap={1}>
                <Text fontSize="10px" color="gray.400" fontWeight="bold">
                  {category}
                </Text>
                <HStack gap={1}>
                  {options.map((option) => {
                    return (
                      <OddsButton
                        key={option.id}
                        option={option}
                        isSelected={selectedOdds.includes(option.id)}
                        onClick={() => onOddsSelect(option.id)}
                        highlight={highlights[option.id]}
                      />
                    );
                  })}
                </HStack>
              </VStack>
            ))}
          </HStack>
        </Flex>
      </Box>
    );
  }
);

MatchRow.displayName = "MatchRow";

export default MatchRow;
