// app/api/query/route.js
import Database from 'better-sqlite3';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: { json: () => any; }) {
  let db = null;
  
  try {
    const body = await request.json();

    const query = body?.query;
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    const dbPath = path.join(process.cwd(), 'app.db');
    
    try {
      // Open database in read-write mode for DML/DDL operations
      db = new Database(dbPath, { fileMustExist: true });
    } catch (openErr) {
      return NextResponse.json(
        { error: 'Failed to open database', detail: String(openErr) },
        { status: 500 }
      );
    }

    try {
      const stmt = db.prepare(query);

      // Check if it's a SELECT query or DML/DDL
      const isSelectQuery = /^[\s]*(select|with|explain|pragma)\b/i.test(query);
      
      if (isSelectQuery) {
        // For SELECT queries, return data
        const rows = stmt.all();

        // Get columns metadata
        let columns: string[] = [];
        try {
          const meta = stmt.columns();
          if (Array.isArray(meta)) columns = meta.map((c) => c.name);
        } catch (colErr) {
          if (rows.length > 0 && typeof rows[0] === 'object' && rows[0] !== null) {
            columns = Object.keys(rows[0] as Record<string, unknown>);
          }
        }

        return NextResponse.json({
          success: true,
          columns,
          rows,
          rowCount: rows.length,
          type: 'SELECT'
        });
      } else {
        // For DML/DDL operations (INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, etc.)
        const result = stmt.run();
        
        return NextResponse.json({
          success: true,
          message: 'Query executed successfully',
          changes: result.changes,
          lastInsertRowid: result.lastInsertRowid,
          type: 'DML/DDL'
        });
      }

    } catch (dbError) {
      return NextResponse.json(
        { error: `SQL Error: ${String(dbError)}` },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Server Error: ${String(error)}` },
      { status: 500 }
    );
  } finally {
    try {
      db?.close();
    } catch (closeErr) {
      console.error('DB close error', closeErr);
    }
  }
}