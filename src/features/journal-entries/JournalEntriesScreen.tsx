import { PageHeader, PageContent } from "../../components/layout";
import { EmptyState } from "../../components/ui";
import { useGetJournalEntriesQuery } from "../../store/api/journalEntriesApi";
import { JournalEntryCard } from "./JournalEntryCard";

export const JournalEntriesScreen = () => {
  const { data: journalEntries = [], isLoading } = useGetJournalEntriesQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <PageHeader
        title="Journal Entries"
        description="View and manage journal entries"
      />
      <PageContent>
        {journalEntries.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 pb-6">
            {journalEntries
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((entry) => (
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
