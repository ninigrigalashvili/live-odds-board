import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Box, Text, HStack, Badge } from "@chakra-ui/react";
import { FixedSizeList as List } from "react-window";

import MatchRow from "@/components/MatchRow";
import type { Match } from "@/utils/constants";
import { generateMockMatches } from "@/services/mockData";
import { ROW_HEIGHT, TOTAL_MATCHES } from "@/utils/constants";

import { useOddsHighlight } from "@/hooks/useOddsHighlight";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { WebSocketMessage } from "@/services/mockWebSocket";
import { useLocalStorage } from "@/hooks/useLocalstorage";

const OddsBoard = () => {
  // State management
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOdds, setSelectedOdds] = useLocalStorage<string[]>(
    "selectedOdds",
    []
  );
  const [scrollTop, setScrollTop] = useLocalStorage<number>("scrollTop", 0);
  const [updateCount, setUpdateCount] = useState(0);
  // Refs
  const listRef = useRef<List>(null);

  // Custom hooks
  const { highlights, highlightOdds } = useOddsHighlight();

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

  // Restore scroll position after matches load
  useEffect(() => {
    if (!isLoading && listRef.current && scrollTop > 0) {
      listRef.current.scrollTo(scrollTop);
    }
  }, [isLoading, scrollTop]);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      if (message.type === "odds_update") {
        const { matchId, category, optionIndex, newValue } = message.data;

        setMatches((prevMatches) => {
          const newMatches = [...prevMatches];
          if (matchId < newMatches.length) {
            const match = newMatches[matchId];
            if (
              match.bettingOptions[category] &&
              match.bettingOptions[category][optionIndex]
            ) {
              const option = match.bettingOptions[category][optionIndex];
              const oldValue = parseFloat(option.value);
              const newValueNum = parseFloat(newValue);

              // Update the value
              option.value = newValue;

              // Highlight the change
              const highlightType =
                newValueNum > oldValue ? "increase" : "decrease";
              highlightOdds(option.id, highlightType);
            }
          }
          return newMatches;
        });

        setUpdateCount((prev) => prev + 1);
      }
    },
    [highlightOdds]
  );

  // Initialize WebSocket connection
  useWebSocket(handleWebSocketMessage);

  // Handle odds selection
  const handleOddsSelect = useCallback(
    (oddsId: string) => {
      setSelectedOdds((prev) => {
        if (prev.includes(oddsId)) {
          return prev.filter((id) => id !== oddsId);
        } else {
          return [...prev, oddsId];
        }
      });
    },
    [setSelectedOdds]
  );

  // Handle scroll position persistence
  const handleScroll = useCallback(
    ({ scrollOffset }: { scrollOffset: number }) => {
      setScrollTop(scrollOffset);
    },
    [setScrollTop]
  );

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
          highlights={highlights}
          style={style}
        />
      );
    },
    [matches, selectedOdds, handleOddsSelect, highlights]
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const liveMatches = matches.filter((match) => match.isLive).length;
    const totalSelected = selectedOdds.length;

    return {
      total: matches.length,
      live: liveMatches,
      selected: totalSelected,
      updates: updateCount,
    };
  }, [matches, selectedOdds, updateCount]);

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
          <Badge colorPalette="blue">
            Total: {stats.total.toLocaleString()}
          </Badge>
          <Badge colorPalette="green">
            Live: {stats.live.toLocaleString()}
          </Badge>
          <Badge colorPalette="yellow">Selected: {stats.selected}</Badge>
          <Badge colorPalette="purple">Updates: {stats.updates}</Badge>
        </HStack>

        <Text fontSize="sm" color="gray.400">
          🔴 Live updates every 2 seconds
        </Text>
      </HStack>

      {/* React-Window List */}
      <Box h="calc(100% - 60px)">
        <List
          ref={listRef}
          height={window.innerHeight - 140} // Adjust based on header heights
          itemCount={matches.length}
          itemSize={ROW_HEIGHT}
          onScroll={handleScroll}
          initialScrollOffset={scrollTop}
          overscanCount={10}
          width="100%"
        >
          {Row}
        </List>
      </Box>
    </Box>
  );
};

export default OddsBoard;
