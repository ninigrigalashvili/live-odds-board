import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Text, HStack, Badge } from "@chakra-ui/react";

import MatchRow from "@/components/MatchRow";
import type { Match } from "@/utils/constants";
import { generateMockMatches } from "@/services/mockData";

const OddsBoard = () => {
  // State management
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedOdds, setSelectedOdds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize matches data (first 100 for testing)
  useEffect(() => {
    const initializeMatches = async () => {
      setIsLoading(true);
      const mockMatches = generateMockMatches(100);
      setMatches(mockMatches);
      setIsLoading(false);
    };

    initializeMatches();
  }, []);

  // Handle odds selection
  const handleOddsSelect = useCallback((oddsId: string) => {
    setSelectedOdds((prev) => {
      if (prev.includes(oddsId)) {
        return prev.filter((id) => id !== oddsId);
      } else {
        return [...prev, oddsId];
      }
    });
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const liveMatches = matches.filter((match) => match.isLive).length;
    const totalSelected = selectedOdds.length;

    return {
      total: matches.length,
      live: liveMatches,
      selected: totalSelected,
    };
  }, [matches, selectedOdds]);

  if (isLoading) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="xl">Loading matches...</Text>
      </Box>
    );
  }

  return (
    <Box h="calc(100vh - 80px)">
      {/* Stats Header */}
      <HStack
        p={3}
        bg="gray.800"
        borderBottom="1px"
        borderColor="gray.700"
        justify="space-between"
      >
        <HStack gap={4}>
          <Badge colorScheme="blue">
            Total: {stats.total.toLocaleString()}
          </Badge>
          <Badge colorScheme="green">Live: {stats.live.toLocaleString()}</Badge>
          <Badge colorScheme="yellow">Selected: {stats.selected}</Badge>
        </HStack>

        <Text fontSize="sm" color="gray.400">
          Basic OddsBoard (First 100 matches)
        </Text>
      </HStack>

      {/* Matches List */}
      <Box h="calc(100% - 60px)" overflowY="auto">
        {matches.map((match) => (
          <MatchRow
            key={match.id}
            match={match}
            selectedOdds={selectedOdds}
            onOddsSelect={handleOddsSelect}
            highlights={{}}
            style={{}}
          />
        ))}
      </Box>
    </Box>
  );
};

export default OddsBoard;
