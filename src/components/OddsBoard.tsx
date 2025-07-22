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
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  // Refs
  const listRef = useRef<List>(null);

  // Custom hooks
  const { highlights, highlightOdds } = useOddsHighlight();

  // Initialize matches data
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

  // Calculate visible range based on scroll position
  const calculateVisibleRange = useCallback(
    (scrollOffset: number) => {
      if (matches.length === 0) return { start: 0, end: 20 };

      const startIndex = Math.floor(scrollOffset / ROW_HEIGHT);
      const itemsPerScreen = Math.ceil((window.innerHeight - 140) / ROW_HEIGHT);
      const endIndex = Math.min(
        startIndex + itemsPerScreen + 10,
        matches.length - 1
      );

      return { start: startIndex, end: endIndex };
    },
    [matches.length]
  );

  // WebSocket message handler
  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      if (message.type === "odds_update") {
        const { matchId, category, optionIndex } = message.data;

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

              // Generate realistic incremental change
              const changePercent = (Math.random() - 0.5) * 0.2; // -10% to +10%
              const newValueNum = Math.max(
                1.01,
                Math.min(5.0, oldValue * (1 + changePercent))
              );
              const finalValue = newValueNum.toFixed(2);

              // Update the value
              option.value = finalValue;

              // Highlight changes for visible matches
              const isVisible =
                matchId >= visibleRange.start && matchId <= visibleRange.end;
              if (isVisible) {
                const highlightType =
                  newValueNum > oldValue ? "increase" : "decrease";
                highlightOdds(option.id, highlightType);
              }
            }
          }
          return newMatches;
        });

        setUpdateCount((prev) => prev + 1);
      }
    },
    [highlightOdds, visibleRange]
  );

  // Initialize WebSocket connection with visible range
  useWebSocket(handleWebSocketMessage, visibleRange);

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

  // Handle scroll position and update visible range
  const handleScroll = useCallback(
    ({ scrollOffset }: { scrollOffset: number }) => {
      setScrollTop(scrollOffset);

      const newVisibleRange = calculateVisibleRange(scrollOffset);

      // Only update if range actually changed to avoid unnecessary re-renders
      if (
        newVisibleRange.start !== visibleRange.start ||
        newVisibleRange.end !== visibleRange.end
      ) {
        setVisibleRange(newVisibleRange);
      }
    },
    [setScrollTop, calculateVisibleRange, visibleRange]
  );

  // Initialize visible range on mount
  useEffect(() => {
    if (matches.length > 0) {
      const initialRange = calculateVisibleRange(scrollTop);
      setVisibleRange(initialRange);
    }
  }, [matches.length, calculateVisibleRange, scrollTop]);

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
    const activeHighlights = Object.keys(highlights).length;
    const visibleCount = visibleRange.end - visibleRange.start + 1;

    return {
      total: matches.length,
      live: liveMatches,
      selected: totalSelected,
      updates: updateCount,
      activeHighlights,
      visibleCount,
    };
  }, [matches, selectedOdds, updateCount, highlights, visibleRange]);

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
        <HStack gap={4} wrap="wrap">
          <Badge colorPalette="blue">
            Total: {stats.total.toLocaleString()}
          </Badge>
          <Badge colorPalette="green">
            Live: {stats.live.toLocaleString()}
          </Badge>
          <Badge colorPalette="yellow">Selected: {stats.selected}</Badge>
          <Badge colorPalette="purple">Updates: {stats.updates}</Badge>
          <Badge colorPalette="red">Active: {stats.activeHighlights}</Badge>
          <Badge colorPalette="cyan" fontSize="xs">
            Visible: {stats.visibleCount} (#{visibleRange.start}-
            {visibleRange.end})
          </Badge>
        </HStack>

        <Text fontSize="sm" color="gray.400">
          🔴 Live updates • 70% visible matches
        </Text>
      </HStack>

      {/* React-Window List */}
      <Box h="calc(100% - 60px)">
        <List
          ref={listRef}
          height={window.innerHeight - 140}
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
