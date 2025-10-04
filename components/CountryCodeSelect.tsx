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
}

export default function CountrySelect({ value, onChange }: Props) {
  const uniqueCountries = countries.filter(
    (country, index, self) =>
      self.findIndex((c) => c.code === country.code) === index
  );

  const firstCode = uniqueCountries.length > 0 ? uniqueCountries[0].code : "";

  useEffect(() => {
    if ((!value || value === "") && firstCode) {
      onChange(firstCode);
    }
  }, [value, firstCode, onChange]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={firstCode || "Select"} />
      </SelectTrigger>
      <SelectContent>
        {uniqueCountries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.flag} ({country.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
