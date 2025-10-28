export async function GET() {
  try {
    // Proxy the GET request to your backend
    const response = await fetch('http://localhost:5000/api/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Proxy GET /users failed:', err);
    return new Response(
      JSON.stringify({ error: 'Proxy failed', details: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
