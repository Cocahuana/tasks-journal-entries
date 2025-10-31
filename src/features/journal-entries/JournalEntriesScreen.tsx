import { useState } from "react";
import { PageHeader, PageContent } from "../../components/layout";
import { EmptyState, Button } from "../../components/ui";
import { useGetJournalEntriesQuery } from "../../store/api/journalEntriesApi";
import { JournalEntryCard } from "./JournalEntryCard";
import { Select, SelectValue, Button as AriaButton, ListBox, ListBoxItem, Popover } from "react-aria-components";
import { ChevronDown } from "flowbite-react-icons/outline";

type SortOption = "entryNumber" | "date-asc" | "date-desc";

export const JournalEntriesScreen = () => {
  const { data: journalEntries = [], isLoading } = useGetJournalEntriesQuery();
  const [sortBy, setSortBy] = useState<SortOption>("entryNumber");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const getSortedEntries = () => {
    const sorted = [...journalEntries];
    
    switch (sortBy) {
      case "entryNumber":
        return sorted.sort((a, b) => 
          a.entryNumber.localeCompare(b.entryNumber, undefined, { numeric: true })
        );
      case "date-asc":
        return sorted.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case "date-desc":
        return sorted.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      default:
        return sorted;
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "entryNumber":
        return "Entry Number";
      case "date-asc":
        return "Date (Oldest First)";
      case "date-desc":
        return "Date (Newest First)";
      default:
        return "Sort by";
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <PageHeader
        title="Journal Entries"
        description="View and manage journal entries"
        actions={
          <Select
            key={sortBy}
            onChange={(key) => setSortBy(key as SortOption)}
          >
            <AriaButton className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors">
              <span>Sort: {getSortLabel()}</span>
              <ChevronDown className="w-4 h-4" />
            </AriaButton>
            <Popover className="w-[--trigger-width]">
              <ListBox className="border border-gray-300 rounded-md shadow-lg bg-white mt-1 max-h-60 overflow-auto p-1">
                <ListBoxItem 
                  id="entryNumber"
                  className="px-3 py-2 text-sm rounded cursor-pointer outline-none hover:bg-gray-100 data-[selected]:bg-gray-900 data-[selected]:text-white data-[focused]:ring-2 data-[focused]:ring-black data-[focused]:ring-inset"
                >
                  Entry Number
                </ListBoxItem>
                <ListBoxItem 
                  id="date-desc"
                  className="px-3 py-2 text-sm rounded cursor-pointer outline-none hover:bg-gray-100 data-[selected]:bg-gray-900 data-[selected]:text-white data-[focused]:ring-2 data-[focused]:ring-black data-[focused]:ring-inset"
                >
                  Date (Newest First)
                </ListBoxItem>
                <ListBoxItem 
                  id="date-asc"
                  className="px-3 py-2 text-sm rounded cursor-pointer outline-none hover:bg-gray-100 data-[selected]:bg-gray-900 data-[selected]:text-white data-[focused]:ring-2 data-[focused]:ring-black data-[focused]:ring-inset"
                >
                  Date (Oldest First)
                </ListBoxItem>
              </ListBox>
            </Popover>
          </Select>
        }
      />
      <PageContent>
        {journalEntries.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 pb-6">
            {getSortedEntries().map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No journal entries found"
            description="Journal entries will appear here when tasks are executed"
          />
        )}
      </PageContent>
    </div>
  );
};
