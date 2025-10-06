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
import { useLanguage } from "@/hooks/use-language";
import { getTranslation } from "@/lib/i18n";

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
  const { language } = useLanguage();
  const t = (key: string) => (getTranslation(language, key) as string) || key;

  const LIMIT = 10;
  const ALL_VALUE = "all";

  const [items, setItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  const normalizeResponse = (res: any): string[] => {
    if (!res) return [];
    if (Array.isArray(res)) return res.map((x) => (typeof x === "string" ? x : (x.name ?? x.key ?? String(x))));
    if (res.items && Array.isArray(res.items)) return res.items.map((x: any) => (typeof x === "string" ? x : (x.name ?? x.key ?? String(x))));
    if (res.data && Array.isArray(res.data)) return res.data.map((x: any) => (typeof x === "string" ? x : (x.name ?? x.key ?? String(x))));
    if (typeof res === "object") {
      try {
        const vals = Object.values(res).flat();
        if (Array.isArray(vals)) return vals.map((v: any) => (typeof v === "string" ? v : (v.name ?? v.key ?? String(v))));
      } catch {}
    }
    return [];
  };

  const loadPage = async (p: number, brd?: string) => {
    if (loading) return;
    if (!hasMore && p !== 1) return;
    setLoading(true);
    const thisRequestId = ++requestIdRef.current;

    try {
      let res;
      if (brd && brd !== ALL_VALUE) {
        if (typeof (apiClient as any).carsSpesificData !== "function") throw new Error("apiClient.carsSpesificData not available");
        res = await (apiClient as any).carsSpesificData(p, LIMIT, brd);
      } else {
        if (typeof (apiClient as any).carsModel !== "function") throw new Error("apiClient.carsModel not available");
        res = await (apiClient as any).carsModel(p, LIMIT);
      }

      if (thisRequestId !== requestIdRef.current) return;

      const arr = normalizeResponse(res);
      const unique = Array.from(new Set(arr));

      setItems((prev) => (p === 1 ? unique : Array.from(new Set([...prev, ...unique]))));

      setHasMore(unique.length >= LIMIT);
      setPage(p);
    } catch (err) {
      console.error("Model load failed:", err);
    } finally {
      if (thisRequestId === requestIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1, brand);
  }, [brand]);

  const performSearch = (q: string) => {
    const trimmed = q.trim();
    if (trimmed === "") {
      setItems([]);
      setPage(1);
      setHasMore(true);
      loadPage(1, brand);
      return;
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
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      if (!loading && hasMore) loadPage(page + 1, brand);
    }
  };

  const handleValueChange = (v: string) => {
    onChange(v === ALL_VALUE ? "" : v);
  };

  return (
    <Select value={value === "" ? ALL_VALUE : value} onValueChange={handleValueChange}>
      <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300">
        <SelectValue placeholder={t("placeholderAllItems") || placeholder} />
      </SelectTrigger>

      <SelectContent side="bottom" align="start" className="p-0">
        <div className="px-3 py-2 border-b border-gray-100 bg-white">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              if (items.length === 0 && !loading) loadPage(1, brand);
            }}
            placeholder={t("searchbuttonPlaceholder") || searchPlaceholder}
            className="w-full text-sm p-2 border rounded-md border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="max-h-60 overflow-auto"
          style={{ minWidth: 220 }}
        >
          <SelectItem value={ALL_VALUE}>{t("placeholderAllItems") || "ALL"}</SelectItem>

          {items.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}

          {loading && (
            <div className="p-2 text-center text-sm text-gray-500">{t("loading")}...</div>
          )}

          {!hasMore && !loading && items.length === 0 && (
            <div className="p-2 text-center text-sm text-gray-500">{t("noModels")}</div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
