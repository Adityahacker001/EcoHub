"use client";
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface DataTableProps {
  title: string;
  columns: {
    key: string;
    header: string;
    // render receives the cell value and the full row (second arg optional for backward compatibility)
    render?: (value: any, row?: any) => React.ReactNode;
  }[];
  data: any[];
  actions?: boolean;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
}

const DataTable: React.FC<DataTableProps> = ({ title, columns, data, actions, onView, onEdit, onDelete, tableClassName = '', headerClassName = '', rowClassName = '' }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="relative w-full overflow-auto">
        <Table className={tableClassName}>
          <TableHeader className={headerClassName}>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.header}</TableHead>
              ))}
              {actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className={rowClassName}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell>
                    {onView && (
                      <Button variant="ghost" size="icon" onClick={() => onView(row)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button variant="ghost" size="icon" onClick={() => onEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="icon" onClick={() => onDelete(row)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
