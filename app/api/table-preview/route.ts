// app/api/table-preview/route.js
import Database from 'better-sqlite3';
import path from 'path';

export async function POST(request: { json: () => PromiseLike<{ tableName: any; }> | { tableName: any; }; }) {
  try {
    const { tableName } = await request.json();
    
    if (!tableName || typeof tableName !== 'string') {
      return Response.json({ 
        error: 'Table name is required' 
      }, { status: 400 });
    }

    const dbPath = path.join(process.cwd(), 'app.db');
    const db = new Database(dbPath, { readonly: true });

    // Validate table exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name = ?
    `).get(tableName);

    if (!tableExists) {
      db.close();
      return Response.json({ 
        error: `Table '${tableName}' does not exist` 
      }, { status: 404 });
    }

    // Get table preview (first 20 rows)
    const results = db.prepare(`
      SELECT * FROM "${tableName}" LIMIT 20
    `).all();
    
    const columns = results.length > 0 ? Object.keys(results[0] as object) : [];
    
    db.close();

    return Response.json({
      success: true,
      table: tableName,
      columns,
      rows: results,
      rowCount: results.length
    });
  } catch (error) {
    return Response.json({ 
      error:  (error as Error).message 
    }, { status: 500 });
  }
}