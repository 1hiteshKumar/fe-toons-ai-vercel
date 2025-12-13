/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useRef,
  useCallback,
  useContext,
  ReactNode,
} from "react";
import { baseFetch } from "../baseFetchUtil";
import { toast } from "sonner";

interface PollingOptions<T> {
  url: string;
  pollingKey: string;
  callback: (data: T | null) => void;
  delay?: number;
  baseUrl?: string;
  failData?: T | null;
  headers?: Record<string, string>;
}

interface PollingContextType {
  poll: <T>(options: PollingOptions<T>) => void;
  stopPolling: (pollingKey: string) => void;
}

const PollingContext = createContext<PollingContextType | undefined>(undefined);

export const PollingProvider = ({ children }: { children: ReactNode }) => {
  const pollingRequestsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const stopPolling = useCallback((pollingKey: string) => {
    const intervalId = pollingRequestsRef.current.get(pollingKey);

    if (intervalId) {
      clearInterval(intervalId);
      pollingRequestsRef.current.delete(pollingKey);
    }
  }, []);

  const poll = useCallback(
    <T,>({
      url,
      baseUrl,
      pollingKey,
      callback,
      delay = 2000,
      failData = null,
      headers = {},
    }: PollingOptions<T>) => {
      if (pollingRequestsRef.current.has(pollingKey)) {
        return;
      }

      const fetchData = async () => {
        try {
          const data = await baseFetch(
            url,
            {
              method: "GET",
              headers,
            },
            baseUrl
          );

          let sendError = false;
          if (data.status === 429) {
            toast.error(String(data.error || "Too many requests!"));
            sendError = true;
          }
          if (pollingRequestsRef.current.has(pollingKey)) {
            callback(sendError ? failData : data);
          }
        } catch (error: any) {
          console.error(`Polling error for ${pollingKey}: ${error}`);
          const code = String(error?.statusCode || 0);
          if (code.startsWith("4") || code.startsWith("5")) {
            callback(failData || null);
            stopPolling(pollingKey);
          }
        }
      };

      fetchData();

      const intervalId = setInterval(fetchData, delay);
      pollingRequestsRef.current.set(pollingKey, intervalId);

      return () => {
        clearInterval(intervalId);
        pollingRequestsRef.current.delete(pollingKey);
      };
    },
    []
  );

  return (
    <PollingContext.Provider value={{ poll, stopPolling }}>
      {children}
    </PollingContext.Provider>
  );
};

const usePolling = (): PollingContextType => {
  const context = useContext(PollingContext);
  if (!context) {
    throw new Error("usePolling must be used within a PollingProvider");
  }
  return context;
};

export default usePolling;
