import { useCallback, useEffect, useState } from "react";
import { useShop } from "@shared/hooks/shop.hook";

const MAX = 5;
const VIEWED_KEY = (shopId: string) => `sms:sup:recent-viewed:${shopId}`;
const LINKED_KEY = (shopId: string) => `sms:sup:recent-linked:${shopId}`;

export interface RecentTouch {
  shopId: string;
  name: string;
  at: number;
}

const read = (key: string): RecentTouch[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as RecentTouch[]) : [];
  } catch {
    return [];
  }
};

const write = (key: string, list: RecentTouch[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* quota / private mode */
  }
};

const push = (list: RecentTouch[], item: RecentTouch): RecentTouch[] => {
  const dedup = list.filter((x) => x.shopId !== item.shopId);
  return [item, ...dedup].slice(0, MAX);
};

/**
 * LocalStorage-backed "recently viewed" + "recently linked" supplier shop
 * IDs, scoped to the current buyer shop.
 */
export const useRecentSupplierTouches = () => {
  const { activeShop } = useShop();
  const vKey = VIEWED_KEY(activeShop._id);
  const lKey = LINKED_KEY(activeShop._id);

  const [viewed, setViewed] = useState<RecentTouch[]>(() => read(vKey));
  const [linked, setLinked] = useState<RecentTouch[]>(() => read(lKey));

  // Re-read on shop switch.
  useEffect(() => {
    setViewed(read(vKey));
    setLinked(read(lKey));
  }, [vKey, lKey]);

  const recordView = useCallback(
    (shopId: string, name: string) => {
      const next = push(viewed, { shopId, name, at: Date.now() });
      setViewed(next);
      write(vKey, next);
    },
    [viewed, vKey],
  );

  const recordLink = useCallback(
    (shopId: string, name: string) => {
      const next = push(linked, { shopId, name, at: Date.now() });
      setLinked(next);
      write(lKey, next);
    },
    [linked, lKey],
  );

  const forgetViewed = useCallback(
    (shopId: string) => {
      const next = viewed.filter((x) => x.shopId !== shopId);
      setViewed(next);
      write(vKey, next);
    },
    [viewed, vKey],
  );

  const forgetLinked = useCallback(
    (shopId: string) => {
      const next = linked.filter((x) => x.shopId !== shopId);
      setLinked(next);
      write(lKey, next);
    },
    [linked, lKey],
  );

  return { viewed, linked, recordView, recordLink, forgetViewed, forgetLinked };
};
