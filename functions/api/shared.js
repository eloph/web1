export async function onRequest(context) {
  const { request, env } = context;
  
  // CORS 响应头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // 处理 OPTIONS 请求
  if (request.method === 'OPTIONS') {
    return new Response('OK', { headers });
  }

  try {
    if (request.method === 'GET') {
      // 获取所有共享日记
      const diariesJson = await env.DIARIES_KV.get('diaries');
      const diaries = diariesJson ? JSON.parse(diariesJson) : [];
      
      // 过滤出共享的日记
      const sharedDiaries = diaries.filter(diary => diary.is_public);
      
      return new Response(JSON.stringify({
        success: true,
        data: sharedDiaries
      }), { headers });
    }
    
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  } catch (error) {
    console.error('获取共享日记失败:', error);
    return new Response(JSON.stringify({ error: '服务端错误' }), {
      status: 500,
      headers
    });
  }
}
