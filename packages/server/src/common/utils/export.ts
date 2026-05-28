import * as XLSX from 'xlsx';

export function exportToExcel(
  data: any[],
  columns: { header: string; key: string }[],
  filename: string,
) {
  const ws = XLSX.utils.json_to_sheet(
    data.map((row) => {
      const result: any = {};
      columns.forEach((col) => {
        result[col.header] = row[col.key];
      });
      return result;
    }),
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

export function exportToCSV(
  data: any[],
  columns: { header: string; key: string }[],
): string {
  const headers = columns.map((c) => c.header).join(',');
  const rows = data.map((row) =>
    columns
      .map((c) => `"${(row[c.key] || '').toString().replace(/"/g, '""')}"`)
      .join(','),
  );
  return [headers, ...rows].join('\n');
}
