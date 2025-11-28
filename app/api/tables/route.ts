// app/api/tables/route.js
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use resolve so path is relative to project root
    const dbPath = path.resolve('./app.db');

    // If DB file doesn't exist, return helpful message (200)
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json(
        {
          tables: [],
          message: 'Database not initialized. Run /api/init-db first.'
        },
        { status: 200 }
      );
    }

    let db;
    try {
      // fileMustExist prevents accidental creation of a new empty DB
      db = new Database(dbPath, { readonly: true, fileMustExist: true });

      const rows = db
        .prepare(
          `SELECT name FROM sqlite_master
           WHERE type='table' AND name NOT LIKE 'sqlite_%'
           ORDER BY name`
        )
        .all() as { name: string }[];

      const tables = Array.isArray(rows) ? rows.map((r) => r.name) : [];

      return NextResponse.json({ tables }, { status: 200 });
    } catch (dbErr) {
      return NextResponse.json(
        { error: `DB Error: ${String(dbErr)}` },
        { status: 500 }
      );
    } finally {
      try {
        db?.close();
      } catch (closeErr) {
        // non-fatal — optionally log server-side
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: `Server Error: ${String(err)}` },
      { status: 500 }
    );
  }
}
