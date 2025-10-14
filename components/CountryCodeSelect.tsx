"use client";

import React, { useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { countries } from "./CountryCode";

interface Props {
  value: string;
  onChange: (value: string) => void;
  preferredFirstCode?: string;
}

export default function CountrySelect({
  value,
  onChange,
  preferredFirstCode = "+48", 
}: Props) {
  const uniqueCountries = countries.filter(
    (country, index, self) =>
      self.findIndex((c) => c.code === country.code) === index
  );
  const preferred = uniqueCountries.find((c) => c.code === preferredFirstCode);
  const orderedCountries = preferred
    ? [preferred, ...uniqueCountries.filter((c) => c.code !== preferredFirstCode)]
    : uniqueCountries;

  const firstCode = orderedCountries.length > 0 ? orderedCountries[0].code : "";
  useEffect(() => {
    if ((!value || value === "") && firstCode) {
      onChange(firstCode);
    }
  }, [value, firstCode, onChange]);
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={orderedCountries.length > 0 ? `${orderedCountries[0].flag} (${orderedCountries[0].code})` : "Select"} />
      </SelectTrigger>
      <SelectContent>
        {orderedCountries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.flag} ({country.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
