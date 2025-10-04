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
  const LIMIT = 10;
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
    if (Array.isArray(res)) return res as string[];
    if (res.items && Array.isArray(res.items)) return res.items as string[];
    if (res.data && Array.isArray(res.data)) return res.data as string[];
    if (typeof res === "object") {
      try {
        const vals = Object.values(res).flat();
        if (Array.isArray(vals)) return vals as string[];
      } catch {
      }
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
      if (brd && brd !== "all") {
        res = await apiClient.carsSpesificData(p, LIMIT, brd);
      } else {
        res = await apiClient.carsModel(p, LIMIT);
      }

      if (thisRequestId !== requestIdRef.current) return; // stale

      const arr = normalizeResponse(res);
      setItems((prev) => {
        if (p === 1) return Array.from(new Set(arr));
        const merged = [...prev, ...arr];
        return Array.from(new Set(merged));
      });
      setHasMore(arr.length >= LIMIT);
      setPage(p);
    } catch (err) {
      console.error("Model load failed:", err);
    } finally {
      if (thisRequestId === requestIdRef.current) setLoading(false);
    }
  };

  const performSearch = async (q: string, brd?: string) => {
    const trimmed = q.trim();
    if (trimmed === "") {
      setItems([]);
      setPage(1);
      setHasMore(true);
      loadPage(1, brd);
      return;
    }

    setLoading(true);
    const thisRequestId = ++requestIdRef.current;
    try {
      const res = await apiClient.carsModelSearch(trimmed);
      if (thisRequestId !== requestIdRef.current) return; // stale

      let matched = normalizeResponse(res);
      if (brd && brd !== "all") {
        const brandRes = await apiClient.carsSpesificData(1, 10000, brd);
        if (thisRequestId !== requestIdRef.current) return; // stale

        const brandVals = normalizeResponse(brandRes);
        const brandSet = new Set(brandVals.map((v) => v.toLowerCase()));
        matched = matched.filter((m) => brandSet.has(m.toLowerCase()));
      }

      setItems(Array.from(new Set(matched)));
      setHasMore(false);
      setPage(1);
    } catch (err) {
      console.error("Model search failed:", err);
    } finally {
      if (thisRequestId === requestIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    if (search.trim().length > 0) {
      performSearch(search, brand);
    } else {
      loadPage(1, brand);
    }
  }, []);
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    if (search.trim().length > 0) {
      performSearch(search, brand);
    } else {
      loadPage(1, brand);
    }
  }, [brand]);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      setItems([]);
      setPage(1);
      setHasMore(true);
      performSearch(search, brand);
    }, 400);

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

  return (
    <Select value={value} onValueChange={(v) => onChange(v)}>
      <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent side="bottom" align="start" className="p-0">
        <div className="px-3 py-2 border-b border-gray-100 bg-white">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full text-sm p-2 border rounded-md border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="max-h-60 overflow-auto"
          style={{ minWidth: 220 }}
        >
          <SelectItem value="all">{placeholder}</SelectItem>
          {items.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
          {loading && <div className="p-2 text-center text-sm text-gray-500">Loading...</div>}
          {!hasMore && !loading && items.length === 0 && (
            <div className="p-2 text-center text-sm text-gray-500">No models</div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
