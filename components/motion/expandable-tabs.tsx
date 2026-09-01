/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ExpandableTabsContextType {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  close: () => void;
}

export const ExpandableTabsContext = createContext<ExpandableTabsContextType>({
  activeId: null,
  setActiveId: () => {},
  close: () => {},
});

export const useExpandableTabs = () => useContext(ExpandableTabsContext);

export type ExpandableTabsItem = {
  id: string;
  /** String label — shown inside the active tab and used as the button's accessible name. */
  label: string;
  icon: ReactNode;
  /** Panel shown above the bar when this tab is active. */
  content?: ReactNode;
  /** Optional direct link URL */
  href?: string;
  /** Optional onClick callback */
  onClick?: () => void;
  /** Optional badge count or indicator */
  badge?: string | number;
};

export type ExpandableTabsClassNames = {
  root?: string;
  panel?: string;
  bar?: string;
  tab?: string;
  activeTab?: string;
  icon?: string;
  label?: string;
  pill?: string;
};

export interface ExpandableTabsProps {
  items: ExpandableTabsItem[];
  /** Active tab id, or null/undefined for the closed (bar-only) state. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (id: string | null) => void;
  className?: string;
  classNames?: ExpandableTabsClassNames;
}

type Size = { width: number; height: number };

// Smooth spring physics for fluid auto-resizing across different tab sizes
const SHELL_SPRING = { type: "spring", duration: 0.48, bounce: 0.05 } as const;
const TAB_CHANGE_SPRING = {
  type: "spring",
  duration: 0.4,
  bounce: 0.04,
} as const;
const LABEL_OPEN = { type: "spring", duration: 0.35, bounce: 0.03 } as const;
const LABEL_CLOSE = { duration: 0.15, ease: EASE_OUT } as const;

const BAR_H = 54;
const TAB_W = 36;
const BAR_X = 16;
const BAR_GAP = 4;
const ROOT_BORDER = 2;
const ICON_W = 16;
const ACTIVE_LEFT_PAD = 10;
const ACTIVE_RIGHT_PAD = 14;
const LABEL_GAP = 6;
const PANEL_DOCK_GAP = 4;

const CONTENT_VARIANTS: Variants = {
  enter: { y: -8, scale: 0.98, opacity: 0, filter: "blur(5px)" },
  center: { y: 0, scale: 1, opacity: 1, filter: "blur(0px)" },
  exit: {
    y: -6,
    scale: 0.98,
    opacity: 0,
    filter: "blur(5px)",
    transition: { duration: 0.08, ease: EASE_OUT },
  },
};

const REDUCED_CONTENT_VARIANTS: Variants = {
  enter: { opacity: 0, filter: "blur(0px)" },
  center: { opacity: 1, filter: "blur(0px)" },
  exit: {
    opacity: 0,
    filter: "blur(0px)",
    transition: { duration: 0.08, ease: EASE_OUT },
  },
};

const CONTENT_SPRING = { type: "spring", duration: 0.42, bounce: 0.06 } as const;

function sameWidths(a: Record<string, number>, b: Record<string, number>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  return aKeys.every((key) => a[key] === b[key]);
}

/** Measures the content dimensions of each tab independently */
function useItemContentSizes(items: ExpandableTabsItem[]) {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const [sizes, setSizes] = useState<Record<string, Size>>({});

  const setItemRef = useCallback(
    (id: string) => (node: HTMLDivElement | null) => {
      refs.current[id] = node;
    },
    [],
  );

  const measure = useCallback(() => {
    const next: Record<string, Size> = {};
    for (const item of items) {
      const node = refs.current[item.id];
      if (node) {
        next[item.id] = {
          width: Math.ceil(node.offsetWidth),
          height: Math.ceil(node.offsetHeight),
        };
      }
    }
    setSizes((curr) => {
      const currKeys = Object.keys(curr);
      const nextKeys = Object.keys(next);
      if (currKeys.length !== nextKeys.length) return next;
      const isSame = currKeys.every(
        (k) =>
          curr[k]?.width === next[k]?.width &&
          curr[k]?.height === next[k]?.height,
      );
      return isSame ? curr : next;
    });
  }, [items]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    for (const item of items) {
      const node = refs.current[item.id];
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [items, measure]);

  return { setItemRef, sizes };
}

function useLabelWidths(items: ExpandableTabsItem[]) {
  const refs = useRef<Record<string, HTMLSpanElement | null>>({});
  const [widths, setWidths] = useState<Record<string, number>>({});

  const setLabelMeasureRef = useCallback(
    (id: string) => (node: HTMLSpanElement | null) => {
      refs.current[id] = node;
    },
    [],
  );

  const measure = useCallback(() => {
    const next: Record<string, number> = {};

    for (const item of items) {
      const node = refs.current[item.id];

      if (node) {
        next[item.id] = Math.ceil(node.offsetWidth);
      }
    }

    setWidths((current) => (sameWidths(current, next) ? current : next));
  }, [items]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(measure);

    for (const item of items) {
      const node = refs.current[item.id];

      if (node) {
        observer.observe(node);
      }
    }

    return () => observer.disconnect();
  }, [items, measure]);

  return { setLabelMeasureRef, widths };
}

export function ExpandableTabs({
  items,
  value,
  defaultValue = null,
  onValueChange,
  className,
  classNames,
}: ExpandableTabsProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const { setItemRef, sizes: itemSizes } = useItemContentSizes(items);
  const { setLabelMeasureRef, widths: labelWidths } = useLabelWidths(items);

  const controlled = value !== undefined;
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const activeId = controlled ? value : internal;
  const active = items.find((item) => item.id === activeId) ?? null;
  const visualActiveId = active?.id ?? null;

  const setActive = useCallback(
    (next: string | null) => {
      if (!controlled) setInternal(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  const close = useCallback(() => {
    setActive(null);
  }, [setActive]);

  // Outside click / Escape closes
  useEffect(() => {
    if (!visualActiveId) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setActive(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [setActive, visualActiveId]);

  // Closed dock width based on tab counts
  const closedSize = {
    width:
      items.length * TAB_W +
      Math.max(0, items.length - 1) * BAR_GAP +
      BAR_X +
      ROOT_BORDER,
    height: BAR_H + ROOT_BORDER,
  };

  // Specific size of the currently active tab content
  const activeTabContentSize = active ? itemSizes[active.id] : null;

  // Auto-resize specifically according to the active tab's measured dimensions
  const openSize =
    activeTabContentSize && active?.content
      ? {
          width: Math.max(
            activeTabContentSize.width + ROOT_BORDER,
            closedSize.width,
          ),
          height: Math.max(
            activeTabContentSize.height + ROOT_BORDER,
            closedSize.height,
          ),
        }
      : closedSize;

  const targetSize = active?.content ? openSize : closedSize;

  const getActiveTabWidth = useCallback(
    (item: ExpandableTabsItem) =>
      Math.max(
        TAB_W,
        ACTIVE_LEFT_PAD +
          ICON_W +
          LABEL_GAP +
          (labelWidths[item.id] ?? 0) +
          ACTIVE_RIGHT_PAD,
      ),
    [labelWidths],
  );

  const handleTabClick = (item: ExpandableTabsItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.content) {
      setActive(visualActiveId === item.id ? null : item.id);
    } else {
      setActive(null);
    }
  };

  return (
    <ExpandableTabsContext.Provider
      value={{ activeId: visualActiveId, setActiveId: setActive, close }}
    >
      <motion.div
        ref={rootRef}
        initial={false}
        animate={
          targetSize
            ? { width: targetSize.width, height: targetSize.height }
            : undefined
        }
        transition={reduce ? { duration: 0 } : SHELL_SPRING}
        style={{ transformOrigin: "bottom center" }}
        className={cn(
          // Liquid glass base
          "relative overflow-hidden rounded-[28px]",
          "bg-white/60 dark:bg-neutral-950/60",
          "backdrop-blur-2xl backdrop-saturate-150",
          "border border-white/40 dark:border-white/15",
          // Specular highlights & refraction shadows
          "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15),0_10px_20px_-5px_rgba(0,0,0,0.08),inset_0_1.5px_1px_0_rgba(255,255,255,0.7),inset_0_-1px_1px_0_rgba(255,255,255,0.2),inset_0_0_20px_rgba(255,255,255,0.12)]",
          "dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_12px_24px_-6px_rgba(0,0,0,0.5),inset_0_1.5px_1px_0_rgba(255,255,255,0.35),inset_0_-1px_1px_0_rgba(0,0,0,0.4),inset_0_0_20px_rgba(255,255,255,0.03)]",
          "text-foreground max-w-[calc(100vw-1.5rem)]",
          className,
          classNames?.root,
        )}
      >
        {/* Liquid top specular reflection line */}
        <div className="pointer-events-none absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/40 to-transparent" />
        {/* Soft fluid ambient light reflection */}
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-48 rounded-full bg-gradient-to-b from-white/40 via-white/10 to-transparent blur-xl dark:from-white/10" />

        {/* Hidden Sizers to measure each active tab's content dimensions separately */}
        <div
          aria-hidden
          className="pointer-events-none invisible absolute left-0 top-0 w-max"
        >
          {items.map((item) => (
            <div
              key={item.id}
              ref={setItemRef(item.id)}
              className={cn("w-max px-3 pt-3", classNames?.panel)}
              style={{ paddingBottom: BAR_H + PANEL_DOCK_GAP }}
            >
              {item.content}
            </div>
          ))}
        </div>

        {/* Animated Active Panel Content */}
        <div
          className={cn(
            "absolute left-0 right-0 top-0 z-10 overflow-hidden px-3 pt-3",
            classNames?.panel,
          )}
          style={{ bottom: BAR_H + PANEL_DOCK_GAP }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {active?.content ? (
              <motion.div
                key={active.id}
                variants={reduce ? REDUCED_CONTENT_VARIANTS : CONTENT_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={
                  reduce ? { duration: 0.15, ease: EASE_OUT } : CONTENT_SPRING
                }
                className="w-full flex justify-center"
                style={{
                  transformOrigin: "top center",
                  willChange: "transform, opacity, filter",
                }}
              >
                {active.content}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Bottom Liquid Glass Tab Bar */}
        <div
          role="tablist"
          aria-label="Navigation tabs"
          aria-orientation="horizontal"
          className={cn(
            "absolute bottom-0 left-0 z-20 flex w-full items-center justify-between gap-1 p-2",
            classNames?.bar,
          )}
          style={{ height: BAR_H }}
        >
          {items.map((item) => {
            const isActive = item.id === visualActiveId;
            const activeTabWidth = getActiveTabWidth(item);
            const labelWidth = labelWidths[item.id] ?? 0;

            return (
              <motion.button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={item.label}
                onClick={() => handleTabClick(item)}
                layout={reduce ? false : "position"}
                animate={{
                  width: active && isActive ? activeTabWidth : TAB_W,
                }}
                transition={reduce ? { duration: 0 } : TAB_CHANGE_SPRING}
                className={cn(
                  "relative isolate flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[20px] px-2 text-sm font-medium outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  active && isActive && "min-w-0 justify-start pl-2.5 pr-3.5",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-white/[0.08]",
                  classNames?.tab,
                  isActive && classNames?.activeTab,
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="liquid-glass-tab-pill"
                    className={cn(
                      "absolute inset-0 -z-10 rounded-[20px]",
                      "bg-gradient-to-b from-white/80 via-white/50 to-white/30 dark:from-white/20 dark:via-white/10 dark:to-white/[0.04]",
                      "backdrop-blur-md",
                      "border border-white/60 dark:border-white/25",
                      "shadow-[0_4px_14px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.05)]",
                      "dark:shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.3)]",
                      classNames?.pill,
                    )}
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  >
                    {/* Inner highlight line on active capsule */}
                    <span className="pointer-events-none absolute inset-x-2 top-0.5 h-[1px] bg-gradient-to-r from-transparent via-white dark:via-white/60 to-transparent" />
                  </motion.span>
                ) : null}
                <span
                  className={cn(
                    "grid shrink-0 place-items-center transition-transform duration-200",
                    isActive ? "scale-105" : "group-hover:scale-105",
                    classNames?.icon,
                  )}
                >
                  {item.icon}
                </span>
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={
                    reduce
                      ? {
                          width: isActive ? labelWidth : 0,
                          opacity: isActive ? 1 : 0,
                          marginLeft: isActive ? LABEL_GAP : 0,
                          filter: "blur(0px)",
                        }
                      : {
                          width: isActive ? labelWidth : 0,
                          opacity: isActive ? 1 : 0,
                          marginLeft: isActive ? LABEL_GAP : 0,
                          filter: isActive ? "blur(0px)" : "blur(3px)",
                        }
                  }
                  transition={
                    reduce
                      ? { duration: 0 }
                      : isActive
                        ? LABEL_OPEN
                        : LABEL_CLOSE
                  }
                  className={cn(
                    "inline-block overflow-hidden whitespace-nowrap text-xs font-semibold tracking-tight",
                    classNames?.label,
                  )}
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Hidden text measurer for dynamic label pill expansion */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 -z-10 flex opacity-0"
      >
        {items.map((item) => (
          <span
            className={cn(
              "whitespace-nowrap text-xs font-semibold leading-none",
              classNames?.label,
            )}
            key={item.id}
            ref={setLabelMeasureRef(item.id)}
          >
            {item.label}
          </span>
        ))}
      </div>
    </ExpandableTabsContext.Provider>
  );
}
