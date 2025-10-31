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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {entry.entryNumber}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{formattedDate}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Posted
            </span>
          </div>
        </div>
        {entry.description && (
          <p className="text-gray-700 mt-3">{entry.description}</p>
        )}
      </div>

      {/* Line Items Table */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Line Items
        </h4>
        <Table aria-label={`Line items for ${entry.entryNumber}`}>
          <TableHeader>
            <Column width="35%">Account</Column>
            <Column width="30%">Memo</Column>
            <Column width="17.5%">Debit</Column>
            <Column width="17.5%">Credit</Column>
          </TableHeader>
          <TableBody>
            {entry.lineItems.map((item, index) => (
              <Row key={item.id || index}>
                <Cell>
                  <span className="font-medium text-gray-900">{item.account}</span>
                </Cell>
                <Cell>
                  <span className="text-gray-600 text-sm">
                    {item.memo || "-"}
                  </span>
                </Cell>
                <Cell>
                  <span className="font-mono text-gray-900">
                    {item.debit > 0 ? formatCurrency(item.debit) : "-"}
                  </span>
                </Cell>
                <Cell>
                  <span className="font-mono text-gray-900">
                    {item.credit > 0 ? formatCurrency(item.credit) : "-"}
                  </span>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-end gap-8">
            <div className="text-right">
              <span className="text-sm font-medium text-gray-600">Total Debits:</span>
              <span className="ml-2 font-mono font-semibold text-gray-900">
                {formatCurrency(totalDebits)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-600">Total Credits:</span>
              <span className="ml-2 font-mono font-semibold text-gray-900">
                {formatCurrency(totalCredits)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

