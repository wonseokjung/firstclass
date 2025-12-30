module.exports = async function (context, req) {
  // CORS 헤더
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    context.res = { status: 200, headers };
    return;
  }

  try {
    const { prompt, apiKey } = req.body;

    if (!prompt || !apiKey) {
      context.res = {
        status: 400,
        headers,
        body: { error: 'prompt와 apiKey가 필요합니다.' }
      };
      return;
    }

    // Veo API 호출
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:generateVideos?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ['VIDEO'],
            aspectRatio: '16:9',
            resolution: '720p'
          }
        })
      }
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

