import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoAdd, IoSearch, IoStorefrontOutline } from "react-icons/io5";
import Transition from "@utils/Transition";
import { useAuth } from "@shared/hooks/auth.hooks";
import { useRecentShops } from "@features/shop/hooks/use-recent-shops.hook";
import { UserRole, UserRoleLabel } from "@shared/enums/user-role.enum";

interface Props {
  align?: "right" | "left";
}

/**
 * Header shop switcher with always-visible search + a "Recently used" list
 * sourced from localStorage. Replaces the legacy ShopSelectDropdown.
 */
const ShopSwitcher: React.FC<Props> = ({ align = "right" }) => {
  const navigate = useNavigate();
  const { activeShop, setActiveShop, user } = useAuth();
  const { recent, recordSwitch } = useRecentShops();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const trigger = useRef<HTMLButtonElement>(null);
  const popover = useRef<HTMLDivElement>(null);

  // Close on outside click / escape.
  useEffect(() => {
    const onClick = ({ target }: MouseEvent) => {
      if (!popover.current || !trigger.current) return;
      if (
        !open ||
        popover.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setOpen(false);
    };
    const onKey = ({ code }: KeyboardEvent) => {
      if (open && code === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!activeShop || !user) return null;

  const allShops = (user.shopsMeta ?? []).map((m) => ({
    shopId: m.shop._id,
    name: m.shop.name,
    roles: (m.roles ?? []) as UserRole[],
  }));

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return allShops;
    return allShops.filter((s) => s.name.toLowerCase().includes(needle));
  }, [allShops, q]);

  const recentInScope = recent
    .filter((r) => allShops.some((s) => s.shopId === r.shopId))
    .filter((r) => r.shopId !== activeShop._id);

  const handlePick = (shopId: string, name: string) => {
    if (setActiveShop(shopId)) {
      recordSwitch(shopId, name);
      setOpen(false);
      setQ("");
    }
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <IoStorefrontOutline className="text-gray-500" />
        <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white max-w-[160px]">
          {activeShop.name}
        </span>
        <svg
          className="w-3 h-3 shrink-0 ml-2 fill-current text-gray-400 dark:text-gray-500"
          viewBox="0 0 12 12"
        >
          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
        </svg>
      </button>

      <Transition
        className={`origin-top-right z-50 absolute top-full w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={open}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        appear={undefined}
      >
        <div ref={popover} className="text-sm">
          {/* Search */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded px-2 py-1">
              <IoSearch className="text-gray-400" />
              <input
                autoFocus
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search my shops…"
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto py-1">
            {/* Recently used */}
            {!q && recentInScope.length > 0 && (
              <Section title="Recently used">
                {recentInScope.map((r) => (
                  <Row
                    key={`r-${r.shopId}`}
                    name={r.name}
                    onClick={() => handlePick(r.shopId, r.name)}
                  />
                ))}
              </Section>
            )}

            {/* All */}
            <Section title={q ? "Results" : "All shops"}>
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-xs text-gray-500">
                  No shops match.
                </div>
              ) : (
                filtered.map((s) => {
                  const isActive = s.shopId === activeShop._id;
                  return (
                    <Row
                      key={s.shopId}
                      name={s.name}
                      isActive={isActive}
                      badge={s.roles
                        .map((r) => UserRoleLabel[r] ?? r)
                        .join(", ")}
                      onClick={() =>
                        !isActive && handlePick(s.shopId, s.name)
                      }
                    />
                  );
                })
              )}
            </Section>
          </div>

          {/* Footer actions */}
          <div className="border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => {
                navigate("/dashboard/shop/add");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <IoAdd /> Add new shop
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/shop/all");
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-violet-600 dark:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              Manage shops →
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div>
    <div className="px-4 pt-2 pb-1 text-[10px] uppercase text-gray-400">
      {title}
    </div>
    <div>{children}</div>
  </div>
);

const Row: React.FC<{
  name: string;
  isActive?: boolean;
  badge?: string;
  onClick: () => void;
}> = ({ name, isActive, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-left ${
      isActive
        ? "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-200"
        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
    }`}
  >
    <span className="flex items-center gap-2 truncate">
      {isActive && <span className="text-xs">✓</span>}
      <span className="truncate">{name}</span>
    </span>
    {badge && (
      <span className="text-[10px] text-gray-500 whitespace-nowrap">
        {badge}
      </span>
    )}
  </button>
);

export default ShopSwitcher;
