import { createContext, useContext } from "react"
import { clsx } from "clsx"

const TableContext = createContext({})

export const Table = ({ className, children, ...props }) => {
  return (
    <div className="w-full overflow-auto">
      <table
        className={clsx(
          "w-full border-collapse text-sm border border-input rounded-lg table-auto",
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

export const TableHeader = ({ children }) => {
  return (
    <TableContext.Provider value={{ isHeader: true }}>
      <thead className="border-b-2 border-input bg-black/5">{children}</thead>
    </TableContext.Provider>
  )
}

export const TableBody = ({ children }) => {
  return (
    <tbody className="[&>tr:nth-child(odd)]:bg-muted/50 [&>tr:nth-child(even)]:bg-muted/20">
      {children}
    </tbody>
  )
}

export const TableRow = ({ className, children, ...props }) => {
  return (
    <tr
      className={clsx(
        "border-b border-input transition-colors hover:bg-black/5",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

export const TableCell = ({ className, children, ...props }) => {
  const { isHeader } = useContext(TableContext)

  const Component = isHeader ? "th" : "td"

  return (
    <Component
      className={clsx(
        "p-4 align-middle text-left border-x border-input first:border-l-0 last:border-r-0",
        isHeader ? "font-semibold text-foreground" : "text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

Table.displayName = "Table"
TableHeader.displayName = "TableHeader"
TableBody.displayName = "TableBody"
TableRow.displayName = "TableRow"
TableCell.displayName = "TableCell"

Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.Cell = TableCell
