exports.handler = async function(event) {
  const { lat, lon, days = 7 } = event.queryStringParameters || {};
  if (!lat || !lon) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing lat/lon' }) };
  }
  const API_KEY = process.env.WORLDTIDES_API_KEY;
  const length = days * 86400;
  try {
    const [extremesRes, heightsRes] = await Promise.all([
      fetch(`https://www.worldtides.info/api/v3?extremes&lat=${lat}&lon=${lon}&length=${length}&key=${API_KEY}`),
      fetch(`https://www.worldtides.info/api/v3?heights&lat=${lat}&lon=${lon}&length=${length}&step=1800&key=${API_KEY}`)
    ]);
    const extremes = await extremesRes.json();
    const heights = await heightsRes.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ extremes, heights })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
