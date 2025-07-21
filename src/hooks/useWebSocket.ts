import { useEffect, useCallback, useRef } from "react";
import { createMockWebSocket, type OddsUpdate } from "@/services/mockWebSocket";

/**
 * React hook to manage the mock WebSocket lifecycle.
 *
 * @param onMessage - Callback fired when a new odds update arrives.
 */
export const useWebSocket = (onMessage: (message: OddsUpdate) => void) => {
  const webSocketRef = useRef<ReturnType<typeof createMockWebSocket> | null>(
    null
  );

  const handleMessage = useCallback(
    (message: OddsUpdate) => {
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

  return webSocketRef.current;
};
