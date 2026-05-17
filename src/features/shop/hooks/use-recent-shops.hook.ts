import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@shared/hooks/auth.hooks";

const MAX = 5;
const KEY = (userId: string) => `sms:shop:recent:${userId}`;

export interface RecentShop {
  shopId: string;
  name: string;
  at: number;
}

const read = (key: string): RecentShop[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as RecentShop[]) : [];
  } catch {
    return [];
  }
};

const write = (key: string, list: RecentShop[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* quota / private mode */
  }
};

/**
 * LocalStorage-backed "recently switched to" shops, scoped to the
 * current user. Used by the header shop-switcher.
 */
export const useRecentShops = () => {
  const { user } = useAuth();
  const key = user ? KEY(user._id) : "sms:shop:recent:anon";

  const [recent, setRecent] = useState<RecentShop[]>(() => read(key));

  useEffect(() => {
    setRecent(read(key));
  }, [key]);

  const recordSwitch = useCallback(
    (shopId: string, name: string) => {
      setRecent((prev) => {
        const dedup = prev.filter((x) => x.shopId !== shopId);
        const next = [{ shopId, name, at: Date.now() }, ...dedup].slice(0, MAX);
        write(key, next);
        return next;
      });
    },
    [key],
  );

  return { recent, recordSwitch };
};
