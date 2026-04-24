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
    if (request.method === 'POST') {
      // 同步数据
      const syncData = await request.json();
      
      // 处理日记数据
      if (syncData.diaries && syncData.diaries.length > 0) {
        const diariesJson = await env.DIARIES_KV.get('diaries');
        const existingDiaries = diariesJson ? JSON.parse(diariesJson) : [];
        
        // 合并日记数据
        for (const diary of syncData.diaries) {
          const existingIndex = existingDiaries.findIndex(d => d.id === diary.id);
          if (existingIndex === -1) {
            // 新日记
            existingDiaries.push(diary);
          } else {
            // 更新现有日记
            existingDiaries[existingIndex] = {
              ...existingDiaries[existingIndex],
              ...diary,
              updated_at: new Date().toISOString()
            };
          }
        }
        
        // 保存到 KV
        await env.DIARIES_KV.put('diaries', JSON.stringify(existingDiaries));
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Sync completed',
        timestamp: new Date().toISOString()
      }), { headers });
    }
    
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  } catch (error) {
    console.error('同步失败:', error);
    return new Response(JSON.stringify({ error: '服务端错误' }), {
      status: 500,
      headers
    });
  }
}
