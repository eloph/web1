addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
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
  
  // 处理 API 请求
  if (path.startsWith('/api/')) {
    const apiPath = path.slice(5);
    
    switch (apiPath) {
      case 'diaries':
        return handleDiaries(request, headers);
      case 'markers':
        return handleMarkers(request, headers);
      case 'sync':
        return handleSync(request, headers);
      default:
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers
        });
    }
  }
  
  // 处理静态文件
  return fetch(request);
}

// 处理日记相关请求
async function handleDiaries(request, headers) {
  const method = request.method;
  
  switch (method) {
    case 'GET':
      // 获取所有日记（包括共享的）
      return new Response(JSON.stringify({
        success: true,
        data: []
      }), { headers });
      
    case 'POST':
      // 创建新日记
      const diaryData = await request.json();
      return new Response(JSON.stringify({
        success: true,
        data: {
          ...diaryData,
          id: Date.now()
        }
      }), { headers });
      
    case 'PUT':
      // 更新日记
      const updateData = await request.json();
      return new Response(JSON.stringify({
        success: true,
        data: updateData
      }), { headers });
      
    case 'DELETE':
      // 删除日记
      return new Response(JSON.stringify({
        success: true,
        message: 'Diary deleted'
      }), { headers });
      
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers
      });
  }
}

// 处理标记相关请求
async function handleMarkers(request, headers) {
  const method = request.method;
  
  switch (method) {
    case 'GET':
      // 获取所有标记
      return new Response(JSON.stringify({
        success: true,
        data: []
      }), { headers });
      
    case 'POST':
      // 创建新标记
      const markerData = await request.json();
      return new Response(JSON.stringify({
        success: true,
        data: {
          ...markerData,
          id: Date.now()
        }
      }), { headers });
      
    case 'DELETE':
      // 删除标记
      return new Response(JSON.stringify({
        success: true,
        message: 'Marker deleted'
      }), { headers });
      
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers
      });
  }
}

// 处理同步请求
async function handleSync(request, headers) {
  const method = request.method;
  
  if (method === 'POST') {
    // 同步数据
    const syncData = await request.json();
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
}