"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { translateString } from "@/lib/i18n";
import { useDefaultLanguage } from "./useLanguage";
import { CarsDataService } from "./CarsDataService";

type Props = {
  value: string;
  brand: string;
  onChange: (v: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
};

const service = new CarsDataService();

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

  const loadPage = (p: number, brd?: string, searchQ?: string) => {
    const isSearch = Boolean(searchQ && searchQ.trim().length > 0);
    if (loading) return;
    if (!hasMore && p !== 1 && !isSearch) return;

    setLoading(true);

    const res = brd && brd !== "" && brd !== "all"
      ? service.getValuesByKeyPaginated(brd, p, LIMIT, searchQ)
      : service.getAllValuesSortedPaginated(p, LIMIT, searchQ);

    const arr = res.items;
    const arrLength = arr.length;

    if (p === 1) {
      const unique = Array.from(new Set(arr));
      setItems(unique);
      setHasMore(arrLength >= LIMIT && p < res.totalPages);
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
        setHasMore(arrLength >= LIMIT && p < res.totalPages);
        setPage(p);
        return merged;
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    setSearch("");
    setItems([]);
    setPage(1);
    setHasMore(true);
    loadPage(1, brand && brand !== "" ? brand : undefined);
  }, [brand]);

  const performSearch = (q: string) => {
    const trimmed = q.trim();
    if (trimmed === "") {
      setItems([]);
      setPage(1);
      setHasMore(true);
      loadPage(1, brand && brand !== "" ? brand : undefined);
      return;
    }

    setLoading(true);
    loadPage(1, brand && brand !== "" ? brand : undefined, trimmed);
    setLoading(false);
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