import { UPDATE_INTERVAL } from "@/utils/constants";

export interface OddsUpdateMessage {
  type: "odds_update";
  data: {
    matchId: number;
    category: string;
    optionIndex: number;
    newValue: string;
    timestamp: number;
  };
}

export type WebSocketMessage = OddsUpdateMessage;

type Listener = (message: OddsUpdateMessage) => void;

export const createMockWebSocket = () => {
  let listeners: Listener[] = [];
  let isConnected = false;
  let interval: ReturnType<typeof setInterval> | null = null;
  let visibleRange = { start: 0, end: 20 }; // Default visible range

  const connect = () => {
    isConnected = true;
    interval = setInterval(sendRandomUpdate, UPDATE_INTERVAL);
  };

  const disconnect = () => {
    isConnected = false;
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  const addListener = (callback: Listener) => {
    listeners.push(callback);
  };

  const removeListener = (callback: Listener) => {
    listeners = listeners.filter((listener) => listener !== callback);
  };

  const setVisibleRange = (start: number, end: number) => {
    visibleRange = { start, end };
  };

  const sendRandomUpdate = () => {
    if (!isConnected) return;

    let matchId: number;

    // 70% chance to update visible matches, 30% chance for any match
    if (Math.random() < 0.7 && visibleRange.end > visibleRange.start) {
      const visibleCount = visibleRange.end - visibleRange.start + 1;
      matchId = Math.floor(Math.random() * visibleCount) + visibleRange.start;
    } else {
      matchId = Math.floor(Math.random() * 10000);
    }

    const update: OddsUpdateMessage = {
      type: "odds_update",
      data: {
        matchId,
        category: getRandomCategory(),
        optionIndex: Math.floor(Math.random() * 3),
        newValue: (Math.random() * 4 + 1).toFixed(2),
        timestamp: Date.now(),
      },
    };

    listeners.forEach((listener) => listener(update));
  };

  const getRandomCategory = (): string => {
    const categories = ["1X2", "Double Chance", "Total", "Both Teams Score"];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  return {
    connect,
    disconnect,
    addListener,
    removeListener,
    setVisibleRange,
    isConnected: () => isConnected,
  };
};
