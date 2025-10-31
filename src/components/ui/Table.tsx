import {
  Table as AriaTable,
  TableHeader as AriaTableHeader,
  Column as AriaColumn,
  TableBody as AriaTableBody,
  Row as AriaRow,
  Cell as AriaCell,
  type TableProps as AriaTableProps,
  type TableHeaderProps as AriaTableHeaderProps,
  type ColumnProps as AriaColumnProps,
  type TableBodyProps as AriaTableBodyProps,
  type RowProps as AriaRowProps,
  type CellProps as AriaCellProps,
  Collection,
  ColumnResizer,
  Group,
  ResizableTableContainer,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

// Table Variants
const tableStyles = tv({
  slots: {
    root: "w-full border border-gray-300 rounded-md ",
    container: "overflow-x-auto overflow-y-hidden",
    table: "w-full border-collapse",
    header: "bg-gray-50 border-b border-gray-300",
    headerRow: "",
    column: [
      "px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wide",
      "border-r border-gray-200 last:border-r-0",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset",
    ],
    columnSortable: "cursor-pointer hover:bg-gray-100 transition-colors",
    body: "bg-white divide-y divide-gray-200",
    row: [
      "hover:bg-gray-50 transition-colors cursor-pointer",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset",
    ],
    rowSelected: "bg-gray-100",
    cell: "px-3 py-2 text-sm text-gray-900 border-r border-gray-200 last:border-r-0",
  },
});

const styles = tableStyles();

// Table Component
export const Table = (props: AriaTableProps) => {
  return (
    <div className={styles.root()}>
      <AriaTable {...props} className={styles.table()} />
    </div>
  );
};

// TableHeader Component
export const TableHeader = <T extends object>(
  props: AriaTableHeaderProps<T>
) => {
  return <AriaTableHeader {...props} className={styles.header()} />;
};

// Column Component
export const Column = (props: AriaColumnProps) => {
  return (
    <AriaColumn
      {...props}
      className={composeRenderProps(props.className, (className) => {
        return `${styles.column()} ${
          props.allowsSorting ? styles.columnSortable() : ""
        } ${className || ""}`;
      })}
    />
  );
};

// TableBody Component
export const TableBody = <T extends object>(props: AriaTableBodyProps<T>) => {
  return <AriaTableBody {...props} className={styles.body()} />;
};

// Row Component
export const Row = <T extends object>(props: AriaRowProps<T>) => {
  return (
    <AriaRow
      {...props}
      className={composeRenderProps(
        props.className,
        (className, renderProps) => {
          return `${styles.row()} ${
            renderProps.isSelected ? styles.rowSelected() : ""
          } ${className || ""}`;
        }
      )}
    />
  );
};

// Cell Component
export const Cell = (props: AriaCellProps) => {
  return <AriaCell {...props} className={styles.cell()} />;
};

// Re-export other table utilities from React Aria Components
export { Collection, ColumnResizer, Group, ResizableTableContainer };
