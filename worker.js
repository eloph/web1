// 声明 KV 存储
const DIARIES_KV = KV_NAMESPACE;

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
      case 'shared':
        return handleSharedDiaries(request, headers);
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
      // 获取所有日记
      try {
        const diariesJson = await DIARIES_KV.get('diaries');
        const diaries = diariesJson ? JSON.parse(diariesJson) : [];
        return new Response(JSON.stringify({
          success: true,
          data: diaries
        }), { headers });
      } catch (error) {
        console.error('获取日记失败:', error);
        return new Response(JSON.stringify({ error: '获取日记失败' }), {
          status: 500,
          headers
        });
      }
      
    case 'POST':
      // 创建新日记
      try {
        const diaryData = await request.json();
        const newDiary = {
          ...diaryData,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // 获取现有日记
        const diariesJson = await DIARIES_KV.get('diaries');
        const diaries = diariesJson ? JSON.parse(diariesJson) : [];
        
        // 添加新日记
        diaries.push(newDiary);
        
        // 保存到 KV
        await DIARIES_KV.put('diaries', JSON.stringify(diaries));
        
        return new Response(JSON.stringify({
          success: true,
          data: newDiary
        }), { headers });
      } catch (error) {
        console.error('创建日记失败:', error);
        return new Response(JSON.stringify({ error: '创建日记失败' }), {
          status: 500,
          headers
        });
      }
      
    case 'PUT':
      // 更新日记
      try {
        const updateData = await request.json();
        const diariesJson = await DIARIES_KV.get('diaries');
        const diaries = diariesJson ? JSON.parse(diariesJson) : [];
        
        const index = diaries.findIndex(d => d.id === updateData.id);
        if (index === -1) {
          return new Response(JSON.stringify({ error: '日记不存在' }), {
            status: 404,
            headers
          });
        }
        
        diaries[index] = {
          ...diaries[index],
          ...updateData,
          updated_at: new Date().toISOString()
        };
        
        await DIARIES_KV.put('diaries', JSON.stringify(diaries));
        
        return new Response(JSON.stringify({
          success: true,
          data: diaries[index]
        }), { headers });
      } catch (error) {
        console.error('更新日记失败:', error);
        return new Response(JSON.stringify({ error: '更新日记失败' }), {
          status: 500,
          headers
        });
      }
      
    case 'DELETE':
      // 删除日记
      try {
        const url = new URL(request.url);
        const id = parseInt(url.searchParams.get('id'));
        
        const diariesJson = await DIARIES_KV.get('diaries');
        const diaries = diariesJson ? JSON.parse(diariesJson) : [];
        
        const filteredDiaries = diaries.filter(d => d.id !== id);
        
        await DIARIES_KV.put('diaries', JSON.stringify(filteredDiaries));
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Diary deleted'
        }), { headers });
      } catch (error) {
        console.error('删除日记失败:', error);
        return new Response(JSON.stringify({ error: '删除日记失败' }), {
          status: 500,
          headers
        });
      }
      
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

// 处理共享日记请求
async function handleSharedDiaries(request, headers) {
  try {
    const diariesJson = await DIARIES_KV.get('diaries');
    const diaries = diariesJson ? JSON.parse(diariesJson) : [];
    
    // 过滤出共享的日记
    const sharedDiaries = diaries.filter(diary => diary.is_public);
    
    return new Response(JSON.stringify({
      success: true,
      data: sharedDiaries
    }), { headers });
  } catch (error) {
    console.error('获取共享日记失败:', error);
    return new Response(JSON.stringify({ error: '获取共享日记失败' }), {
      status: 500,
      headers
    });
  }
}

// 处理同步请求
async function handleSync(request, headers) {
  const method = request.method;
  
  if (method === 'POST') {
    try {
      // 同步数据
      const syncData = await request.json();
      
      // 处理日记数据
      if (syncData.diaries && syncData.diaries.length > 0) {
        const diariesJson = await DIARIES_KV.get('diaries');
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
        await DIARIES_KV.put('diaries', JSON.stringify(existingDiaries));
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Sync completed',
        timestamp: new Date().toISOString()
      }), { headers });
    } catch (error) {
      console.error('同步失败:', error);
      return new Response(JSON.stringify({ error: '同步失败' }), {
        status: 500,
        headers
      });
    }
  }
  
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers
  });
}