module.exports = async function (context, req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    context.res = { status: 200, headers };
    return;
  }

  try {
    const { operationName, apiKey } = req.body;

    if (!operationName || !apiKey) {
      context.res = {
        status: 400,
        headers,
        body: { error: 'operationName과 apiKey가 필요합니다.' }
      };
      return;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${apiKey}`
    );

    const data = await response.json();
    
    context.res = {
      status: 200,
      headers,
      body: data
    };
  } catch (error) {
    context.res = {
      status: 500,
      headers,
      body: { error: error.message }
    };
  }
};

