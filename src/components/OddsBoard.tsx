import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Box, Text, HStack, Badge } from "@chakra-ui/react";
import { FixedSizeList as List } from "react-window";

import MatchRow from "@/components/MatchRow";
import type { Match } from "@/utils/constants";
import { generateMockMatches } from "@/services/mockData";
import { ROW_HEIGHT, TOTAL_MATCHES } from "@/utils/constants";

const OddsBoard = () => {
  // State management
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedOdds, setSelectedOdds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refs
  const listRef = useRef<List>(null);

  // Initialize matches data (first 100 for testing)
  useEffect(() => {
    const initializeMatches = async () => {
      setIsLoading(true);
      const mockMatches = generateMockMatches(TOTAL_MATCHES);
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

  // Row renderer for react-window
  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const match = matches[index];
      if (!match) return null;

      return (
        <MatchRow
          match={match}
          selectedOdds={selectedOdds}
          onOddsSelect={handleOddsSelect}
          highlights={{}}
          style={style}
        />
      );
    },
    [matches, selectedOdds, handleOddsSelect]
  );

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
      {/* React-Window Virtualized List */}
      <Box h="calc(100% - 60px)">
        <List
          ref={listRef}
          height={window.innerHeight - 140} // Adjust based on header heights
          itemCount={matches.length}
          itemSize={ROW_HEIGHT}
          overscanCount={10} // Render 10 extra items for smooth scrolling
          width="100%"
        >
          {Row}
        </List>
      </Box>
    </Box>
  );
};

export default OddsBoard;
