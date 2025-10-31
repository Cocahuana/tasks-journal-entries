import type { JournalEntry } from "../../types";
import { Table, TableHeader, TableBody, Row, Cell, Column } from "../../components/ui";
import { formatCurrency } from "./journalHelpers";

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalDebits = entry.lineItems.reduce((sum, item) => sum + item.debit, 0);
  const totalCredits = entry.lineItems.reduce((sum, item) => sum + item.credit, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow max-w-5xl">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {entry.entryNumber}
            </h3>
            <p className="text-xs text-gray-600 mt-1">{formattedDate}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-900 border border-gray-300">
              Posted
            </span>
          </div>
        </div>
        {entry.description && (
          <p className="text-gray-700 mt-2 text-sm">{entry.description}</p>
        )}
      </div>

      {/* Line Items Table */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Line Items
        </h4>
        <Table aria-label={`Line items for ${entry.entryNumber}`}>
          <TableHeader>
            <Column isRowHeader width="35%">Account</Column>
            <Column width="30%">Memo</Column>
            <Column width="17.5%">Debit</Column>
            <Column width="17.5%">Credit</Column>
          </TableHeader>
          <TableBody>
            {entry.lineItems.map((item, index) => (
              <Row key={item.id || index}>
                <Cell>
                  <span className="font-medium text-gray-900 text-sm">{item.account}</span>
                </Cell>
                <Cell>
                  <span className="text-gray-600 text-xs">
                    {item.memo || "-"}
                  </span>
                </Cell>
                <Cell>
                  <span className="font-mono text-gray-900 text-sm">
                    {item.debit > 0 ? formatCurrency(item.debit) : "-"}
                  </span>
                </Cell>
                <Cell>
                  <span className="font-mono text-gray-900 text-sm">
                    {item.credit > 0 ? formatCurrency(item.credit) : "-"}
                  </span>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>

        {/* Totals */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-end gap-6">
            <div className="text-right">
              <span className="text-xs font-medium text-gray-600">Total Debits:</span>
              <span className="ml-2 font-mono font-semibold text-gray-900 text-sm">
                {formatCurrency(totalDebits)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-gray-600">Total Credits:</span>
              <span className="ml-2 font-mono font-semibold text-gray-900 text-sm">
                {formatCurrency(totalCredits)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

