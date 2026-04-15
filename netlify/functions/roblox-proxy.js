exports.handler = async function(event) {
  const path = event.queryStringParameters.path;

  if (!path) {
    return { statusCode: 400, body: 'Missing path parameter' };
  }

  const url = `https://thumbnails.roblox.com/${path}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch from Roblox API' })
    };
  }
};