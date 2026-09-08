/**
 * A small RFC 4180 CSV parser.
 *
 * Not `split(",")`: 15 of the 20 original menu descriptions contain a comma
 * inside a quoted field, and splitting naively produced 6 columns where there
 * should be 5 — silently shifting every value after the description.
 *
 * Handles quoted fields, commas and newlines inside quotes, and `""` escapes.
 */
export function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  // Strip a UTF-8 BOM and normalise line endings so CRLF files parse the same.
  const text = input.replace(/^﻿/, "").replace(/\r\n?/g, "\n");

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  // Flush whatever the last line left behind (file may not end in a newline).
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

/** Parses a CSV with a header row into objects keyed by column name. */
export function parseCsvRecords(input: string): Record<string, string>[] {
  const [header, ...body] = parseCsv(input);
  if (!header) return [];

  return body.map((cells, index) => {
    if (cells.length !== header.length) {
      throw new Error(
        `CSV baris ${index + 2}: ada ${cells.length} kolom, seharusnya ${header.length}. ` +
          `Isi baris: ${cells.join(" | ")}`,
      );
    }
    return Object.fromEntries(header.map((key, i) => [key.trim(), cells[i].trim()]));
  });
}
