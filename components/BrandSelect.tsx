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
  onChange: (v: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
};

const service = new CarsDataService();

export default function BrandSelect({
  value,
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
  const [localFilter, setLocalFilter] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  const ensureValuePresent = (arr: string[]) => {
    if (value && value.trim().length > 0 && value !== ALL_VALUE && !arr.includes(value)) {
      return [value, ...arr];
    }
    return arr;
  };

  const loadPage = (p: number, searchTerm?: string) => {
    const isSearch = Boolean(searchTerm && searchTerm.trim().length > 0);
    if (loading) return;
    if (!hasMore && !isSearch && p !== 1) return;
    setLoading(true);

    const res = service.getAllKeysSortedPaginated(p, LIMIT, searchTerm);
    const arr = res.items;

    setItems((prev) => {
      let next = ensureValuePresent(isSearch || p === 1 ? arr : [...prev, ...arr]);
      return next;
    });

    setHasMore(res.items.length >= LIMIT && p < res.totalPages);
    setPage(p);
    setLoading(false);
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  useEffect(() => {
    setItems((prev) => (value && value.trim().length > 0 && value !== ALL_VALUE && !prev.includes(value) ? [value, ...prev] : prev));
  }, [value]);

  const onScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      if (!loading && hasMore) loadPage(page + 1);
    }
  };

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      setItems([]);
      setPage(1);
      setHasMore(true);
      setLocalFilter(search || null);

      const trimmed = search.trim();
      if (trimmed.length > 0) loadPage(1, trimmed);
      else {
        loadPage(1);
      }
    }, 350);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [search]);

  const displayedItems = React.useMemo(() => {
    if (!localFilter) return items;
    const q = localFilter.toLowerCase();
    return items.filter((it) => it.toLowerCase().includes(q));
  }, [items, localFilter]);

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
              if (items.length === 0 && !loading) {
                loadPage(1);
              }
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
          <SelectItem value={ALL_VALUE}>{t("placeholderAllItems") || "All"}</SelectItem>

          {displayedItems.map((b) => (
            <SelectItem key={b} value={b}>
              {b}
            </SelectItem>
          ))}

          {loading && (
            <div className="p-2 text-center text-sm text-gray-500">{t("loading")}...</div>
          )}

          {!hasMore && !loading && displayedItems.length === 0 && (
            <div className="p-2 text-center text-sm text-gray-500">{t("noBrands")}</div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}