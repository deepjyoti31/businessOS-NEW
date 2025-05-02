import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { timezones, Timezone } from "@/data/timezones";

interface TimezoneSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function TimezoneSelect({
  value,
  onValueChange,
  disabled = false,
}: TimezoneSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTimezones, setFilteredTimezones] = useState<Timezone[]>(timezones);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get the display label for the current value
  const selectedTimezone = timezones.find((tz) => tz.value === value);
  const displayValue = selectedTimezone
    ? `${selectedTimezone.label} (${selectedTimezone.offset})`
    : value;

  // Filter timezones based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTimezones(timezones);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = timezones.filter(
      (tz) =>
        tz.label.toLowerCase().includes(query) ||
        tz.value.toLowerCase().includes(query) ||
        tz.offset.toLowerCase().includes(query)
    );
    setFilteredTimezones(filtered);
  }, [searchQuery]);

  // Focus the search input when the popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Group timezones by region
  const groupedTimezones: Record<string, Timezone[]> = {};
  filteredTimezones.forEach((tz) => {
    const region = tz.value.split("/")[0];
    if (!groupedTimezones[region]) {
      groupedTimezones[region] = [];
    }
    groupedTimezones[region].push(tz);
  });

  // Special case for UTC
  if (filteredTimezones.some(tz => tz.value === "UTC")) {
    groupedTimezones["UTC"] = filteredTimezones.filter(tz => tz.value === "UTC");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="truncate">{displayValue}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              ref={inputRef}
              placeholder="Search timezone..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex-1"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CommandList className="max-h-[300px] overflow-auto">
            <CommandEmpty>No timezone found.</CommandEmpty>
            {Object.keys(groupedTimezones).sort().map((region) => (
              <CommandGroup key={region} heading={region} className="text-sm font-medium text-primary">
                {groupedTimezones[region].map((timezone) => (
                  <CommandItem
                    key={timezone.value}
                    value={timezone.value}
                    onSelect={() => {
                      onValueChange(timezone.value);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between hover:bg-accent"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{timezone.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {timezone.offset}
                      </span>
                    </div>
                    {value === timezone.value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default TimezoneSelect;
