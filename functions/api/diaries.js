export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;
  
  // CORS 响应头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // 处理 OPTIONS 请求
  if (method === 'OPTIONS') {
    return new Response('OK', { headers });
  }

  try {
    switch (method) {
      case 'GET':
        // 获取所有日记
        const diariesJson = await env.DIARIES_KV.get('diaries');
        const diaries = diariesJson ? JSON.parse(diariesJson) : [];
        return new Response(JSON.stringify({
          success: true,
          data: diaries
        }), { headers });
      
      case 'POST':
        // 创建新日记
        const diaryData = await request.json();
        const newDiary = {
          ...diaryData,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // 获取现有日记
        const existingDiariesJson = await env.DIARIES_KV.get('diaries');
        const existingDiaries = existingDiariesJson ? JSON.parse(existingDiariesJson) : [];
        
        // 添加新日记
        existingDiaries.push(newDiary);
        
        // 保存到 KV
        await env.DIARIES_KV.put('diaries', JSON.stringify(existingDiaries));
        
        return new Response(JSON.stringify({
          success: true,
          data: newDiary
        }), { headers });
      
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers
        });
    }
  } catch (error) {
    console.error('处理日记请求失败:', error);
    return new Response(JSON.stringify({ error: '服务端错误' }), {
      status: 500,
      headers
    });
  }
}
