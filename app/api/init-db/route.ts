// app/api/init-db/route.js


export async function GET() {
  try {
    initDatabase
    return Response.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error 
    }, { status: 500 });
  }
}