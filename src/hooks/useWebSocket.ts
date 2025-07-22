import { useEffect, useCallback, useRef } from "react";
import {
  createMockWebSocket,
  type OddsUpdateMessage,
} from "@/services/mockWebSocket";

/**
 * React hook to manage the mock WebSocket lifecycle with visible range support.
 *
 * @param onMessage - Callback fired when a new odds update arrives.
 * @param visibleRange - Current visible range of matches for prioritized updates
 */
export const useWebSocket = (
  onMessage: (message: OddsUpdateMessage) => void,
  visibleRange?: { start: number; end: number }
) => {
  const webSocketRef = useRef<ReturnType<typeof createMockWebSocket> | null>(
    null
  );

  const handleMessage = useCallback(
    (message: OddsUpdateMessage) => {
      onMessage?.(message);
    },
    [onMessage]
  );

  useEffect(() => {
    webSocketRef.current = createMockWebSocket();
    webSocketRef.current.addListener(handleMessage);
    webSocketRef.current.connect();

    return () => {
      webSocketRef.current?.removeListener(handleMessage);
      webSocketRef.current?.disconnect();
    };
  }, [handleMessage]);

  // Update visible range when it changes
  useEffect(() => {
    if (webSocketRef.current && visibleRange) {
      webSocketRef.current.setVisibleRange(
        visibleRange.start,
        visibleRange.end
      );
    }
  }, [visibleRange]);

  return webSocketRef.current;
};
