"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";
import { translateString } from "@/lib/i18n";
import { useDefaultLanguage } from "./useLanguage";

type Props = {
  value: string;
  brand: string;
  onChange: (v: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
};

export default function ModelSelect({
  value,
  brand,
  onChange,
  placeholder = "All",
  searchPlaceholder = "Search...",
}: Props) {
  const { lang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);

  const LIMIT = 10;
  const ALL_VALUE = "all";

  const [items, setItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  const normalizeResponse = (res: any): { items: string[]; meta?: any } => {
    if (!res) return { items: [], meta: undefined };
    if (res.items && Array.isArray(res.items)) return { items: res.items.map((x: any) => (typeof x === "string" ? x : x?.name ?? x?.key ?? String(x))), meta: res.meta ?? res.pagination ?? undefined };
    if (res.data && Array.isArray(res.data)) return { items: res.data.map((x: any) => (typeof x === "string" ? x : x?.name ?? x?.key ?? String(x))), meta: res.meta ?? res.pagination ?? undefined };
    if (Array.isArray(res)) return { items: res.map((x: any) => (typeof x === "string" ? x : x?.name ?? x?.key ?? String(x))) };
    if (typeof res === "object") {
      try {
        const vals = Object.values(res).flat?.();
        if (Array.isArray(vals)) return { items: vals.map((v: any) => (typeof v === "string" ? v : v?.name ?? v?.key ?? String(v))) };
      } catch {}
    }
    return { items: [], meta: undefined };
  };
  const callApi = async (pageParam: number, limitParam: number, brandArg?: string, searchQ?: string) => {
    if (brandArg && brandArg !== "all" && typeof (apiClient as any).carsSpesificData === "function") {
      return await (apiClient as any).carsSpesificData(pageParam, limitParam, brandArg, searchQ);
    }
    if (typeof (apiClient as any).carsModelSearch === "function" && searchQ) {
      return await (apiClient as any).carsModelSearch(searchQ, undefined);
    }

    return await (apiClient as any).carsModel(pageParam, limitParam);
  };

  const loadPage = async (p: number, brd?: string, searchQ?: string) => {
    const isSearch = Boolean(searchQ && searchQ.trim().length > 0);
    if (loading) return;
    if (!hasMore && p !== 1 && !isSearch) return;

    setLoading(true);
    const thisRequestId = ++requestIdRef.current;

    try {
      const res = await callApi(p, LIMIT, brd && brd !== "" && brd !== "all" ? brd : undefined, searchQ);
      if (thisRequestId !== requestIdRef.current) return;

      const { items: arr, meta } = normalizeResponse(res);
      const arrLength = Array.isArray(arr) ? arr.length : 0;

      if (p === 1) {
        const unique = Array.from(new Set(arr));
        setItems(unique);
        setHasMore(arrLength >= LIMIT);
        setPage(1);
      } else {
        setItems((prev) => {
          const prevSet = new Set(prev);
          const newItems = arr.filter((it: string) => !prevSet.has(it));
          if (newItems.length === 0) {
            setHasMore(false);
            return prev;
          }
          const merged = Array.from(new Set([...prev, ...newItems]));
          setHasMore(arrLength >= LIMIT);
          setPage(p);
          return merged;
        });
      }
    } catch (err) {
      console.error("Model load failed:", err);
    } finally {
      if (thisRequestId === requestIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    setSearch("");
    setItems([]);
    setPage(1);
    setHasMore(true);
    requestIdRef.current++;
    loadPage(1, brand && brand !== "" ? brand : undefined);
  }, [brand]);

  const performSearch = async (q: string) => {
    const trimmed = q.trim();
    if (trimmed === "") {
      setItems([]);
      setPage(1);
      setHasMore(true);
      requestIdRef.current++;
      loadPage(1, brand && brand !== "" ? brand : undefined);
      return;
    }

    setLoading(true);
    const thisRequestId = ++requestIdRef.current;

    try {
      const res = await callApi(1, LIMIT, brand && brand !== "" ? brand : undefined, trimmed);
      if (thisRequestId !== requestIdRef.current) return;

      const { items: arr } = normalizeResponse(res);
      const unique = Array.from(new Set(arr));
      setItems(unique);
      setHasMore(unique.length >= LIMIT);
      setPage(1);
    } catch (err) {
      console.error("Model search failed:", err);
    } finally {
      if (thisRequestId === requestIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => performSearch(search), 350);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [search]);

  const onScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 60;
    if (nearBottom && !loading && hasMore && search.trim() === "") {
      loadPage(page + 1, brand && brand !== "" ? brand : undefined);
    }
  };

  const handleValueChange = (v: string) => {
    onChange(v === ALL_VALUE ? "" : v);
    setOpen(false);
  };

  const stopEvent = (e: React.SyntheticEvent) => e.stopPropagation();
  const handleInputFocus = () => setOpen(true);
  const handleInputBlur = () => {
    setTimeout(() => {
      const active = document.activeElement;
      if (!scrollRef.current || !scrollRef.current.contains(active)) setOpen(false);
    }, 100);
  };

  return (
    <Select
      value={value === "" ? ALL_VALUE : value}
      onValueChange={handleValueChange}
      open={open}
      onOpenChange={(o: boolean) => setOpen(Boolean(o))}
    >
      <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300">
        <SelectValue placeholder={t("placeholderAllItems") || placeholder} />
      </SelectTrigger>

      <SelectContent side="bottom" align="start" className="p-0">
        <div className="px-3 py-2 border-b border-gray-100 bg-white">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onMouseDown={stopEvent}
            onPointerDown={stopEvent}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder={t("searchbuttonPlaceholder") || searchPlaceholder}
            className="w-full text-sm p-2 border rounded-md border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <div ref={scrollRef} onScroll={onScroll} className="max-h-60 overflow-auto" style={{ minWidth: 220 }}>
          <SelectItem value={ALL_VALUE}>{t("placeholderAllItems") || "ALL"}</SelectItem>

          {items.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}

          {loading && <div className="p-2 text-center text-sm text-gray-500">{t("loading") || "Loading"}...</div>}

          {!hasMore && !loading && items.length === 0 && (
            <div className="p-2 text-center text-sm text-gray-500">{t("noModels") || "No models found"}</div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}