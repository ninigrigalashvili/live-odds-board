import { UPDATE_INTERVAL } from "@/utils/constants";

/**
 * Type for an odds update message.
 */
export interface OddsUpdate {
  type: "odds_update";
  data: {
    matchId: number;
    category: string;
    optionIndex: number;
    newValue: string;
    timestamp: number;
  };
}

type Listener = (message: OddsUpdate) => void;

/**
 * Creates a mock WebSocket-like service.
 */
export const createMockWebSocket = () => {
  let listeners: Listener[] = [];
  let isConnected = false;
  let interval: ReturnType<typeof setInterval> | null = null;

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

  const sendRandomUpdate = () => {
    if (!isConnected) return;

    const update: OddsUpdate = {
      type: "odds_update",
      data: {
        matchId: Math.floor(Math.random() * 10000),
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
    isConnected: () => isConnected,
  };
};
