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
  onChange: (v: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
};

export default function BrandSelect({
  value,
  onChange,
  placeholder = "All",
  searchPlaceholder = "Search...",
}: Props) {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key) as string;

  const LIMIT = 10;
  const [items, setItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [localFilter, setLocalFilter] = useState<string | null>(null); 
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  const normalizeResponse = (res: any): string[] => {
    if (!res) return [];
    if (Array.isArray(res)) return res as string[];
    if (res.items && Array.isArray(res.items)) return res.items as string[];
    if (res.data && Array.isArray(res.data)) return res.data as string[];
    if (typeof res === "object") {
      try {
        return Object.keys(res).filter((k) => typeof k === "string");
      } catch {
        return [];
      }
    }
    return [];
  };

  const loadPage = async (p: number, searchTerm?: string) => {
    const isSearch = Boolean(searchTerm && searchTerm.trim().length > 0);
    if (loading) return;
    if (!hasMore && !isSearch && p !== 1) return;
    setLoading(true);
    const thisRequestId = ++requestIdRef.current;

    try {
      let res: any;
      if (isSearch) {
        res = await apiClient.carsMarkSearch(searchTerm!.trim());
      } else {
        res = await apiClient.carsMark(p, LIMIT);
      }
      if (thisRequestId !== requestIdRef.current) return;

      const arr = normalizeResponse(res);

      setItems((prev) => {
        if (isSearch) {
          return Array.from(new Set(arr));
        }
        if (p === 1) return Array.from(new Set(arr));
        const merged = [...prev, ...arr];
        return Array.from(new Set(merged));
      });
      if (isSearch) {
        setHasMore(false);
        setPage(1);
      } else {
        setHasMore(arr.length >= LIMIT);
        setPage(p);
      }
    } catch (err) {
      console.error("Brand load failed:", err);
    } finally {
      if (thisRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  const onScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      if (!loading && hasMore) loadPage(page + 1, undefined);
    }
  };

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      setItems([]);
      setPage(1);
      setHasMore(true);
      setLocalFilter(search || null);

      const trimmed = search.trim();
      if (trimmed.length > 0) {
        loadPage(1, trimmed);
      } else {
        requestIdRef.current++;
        loadPage(1);
      }
    }, 400);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [search]);

  const displayedItems = React.useMemo(() => {
    if (!localFilter) return items;
    const q = localFilter.toLowerCase();
    return items.filter((it) => it.toLowerCase().includes(q));
  }, [items, localFilter]);

  return (
    <Select value={value} onValueChange={(v) => onChange(v)}>
      <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300">
        <SelectValue placeholder={t(placeholder)} />
      </SelectTrigger>

      <SelectContent side="bottom" align="start" className="p-0">
        <div className="px-3 py-2 border-b border-gray-100 bg-white">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(searchPlaceholder)}
            className="w-full text-sm p-2 border rounded-md border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="max-h-60 overflow-auto"
          style={{ minWidth: 220 }}
        >
          <SelectItem value="all">{t(placeholder)}</SelectItem>

          {displayedItems.map((b) => (
            <SelectItem key={b} value={b}>
              {b}
            </SelectItem>
          ))}

          {loading && (
            <div className="p-2 text-center text-sm text-gray-500">
              {t("loading")}...
            </div>
          )}

          {!hasMore && !loading && displayedItems.length === 0 && (
            <div className="p-2 text-center text-sm text-gray-500">
              {t("noBrands")}
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
