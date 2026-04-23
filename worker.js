// Cloudflare Worker 后端 API

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // 处理 API 请求
  if (path.startsWith('/api/')) {
    const apiPath = path.substring(5);

    // 认证 API
    if (apiPath.startsWith('auth/')) {
      const authPath = apiPath.substring(4);
      if (method === 'POST' && authPath === 'register') {
        return handleRegister(request);
      } else if (method === 'POST' && authPath === 'login') {
        return handleLogin(request);
      } else if (method === 'POST' && authPath === 'logout') {
        return handleLogout(request);
      }
    }

    // 日记 API
    else if (apiPath.startsWith('diaries')) {
      if (method === 'GET' && apiPath === 'diaries') {
        return handleGetDiaries(request);
      } else if (method === 'POST' && apiPath === 'diaries') {
        return handleCreateDiary(request);
      } else if (method === 'GET' && apiPath.match(/^diaries\/\w+$/)) {
        const diaryId = apiPath.split('/')[1];
        return handleGetDiary(request, diaryId);
      } else if (method === 'PUT' && apiPath.match(/^diaries\/\w+$/)) {
        const diaryId = apiPath.split('/')[1];
        return handleUpdateDiary(request, diaryId);
      } else if (method === 'DELETE' && apiPath.match(/^diaries\/\w+$/)) {
        const diaryId = apiPath.split('/')[1];
        return handleDeleteDiary(request, diaryId);
      } else if (method === 'GET' && apiPath.match(/^diaries\/\w+\/comments$/)) {
        const diaryId = apiPath.split('/')[1];
        return handleGetComments(request, diaryId);
      } else if (method === 'POST' && apiPath.match(/^diaries\/\w+\/comments$/)) {
        const diaryId = apiPath.split('/')[1];
        return handleCreateComment(request, diaryId);
      }
    }

    // 评论 API
    else if (apiPath.startsWith('comments/')) {
      if (method === 'DELETE' && apiPath.match(/^comments\/\w+$/)) {
        const commentId = apiPath.split('/')[1];
        return handleDeleteComment(request, commentId);
      }
    }

    // 地图标记 API
    else if (apiPath.startsWith('markers')) {
      if (method === 'GET' && apiPath === 'markers') {
        return handleGetMarkers(request);
      } else if (method === 'POST' && apiPath === 'markers') {
        return handleCreateMarker(request);
      } else if (method === 'GET' && apiPath.match(/^markers\/\w+$/)) {
        const markerId = apiPath.split('/')[1];
        return handleGetMarker(request, markerId);
      } else if (method === 'PUT' && apiPath.match(/^markers\/\w+$/)) {
        const markerId = apiPath.split('/')[1];
        return handleUpdateMarker(request, markerId);
      } else if (method === 'DELETE' && apiPath.match(/^markers\/\w+$/)) {
        const markerId = apiPath.split('/')[1];
        return handleDeleteMarker(request, markerId);
      }
    }

    // 同步 API
    else if (apiPath.startsWith('sync')) {
      if (method === 'POST' && apiPath === 'sync') {
        return handleSync(request);
      } else if (method === 'GET' && apiPath === 'sync/status') {
        return handleSyncStatus(request);
      }
    }

    return new Response(JSON.stringify({ error: 'API 路径不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 处理静态文件
  else {
    return await fetch(request);
  }
}

// 认证 API 处理函数
async function handleRegister(request) {
  try {
    const data = await request.json();
    // 模拟注册逻辑
    return new Response(JSON.stringify({ success: true, message: '注册成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '注册失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleLogin(request) {
  try {
    const data = await request.json();
    // 模拟登录逻辑
    return new Response(JSON.stringify({ success: true, token: 'mock-token', user: { id: '1', name: '小企鹅' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '登录失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleLogout(request) {
  try {
    // 模拟登出逻辑
    return new Response(JSON.stringify({ success: true, message: '登出成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '登出失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 日记 API 处理函数
async function handleGetDiaries(request) {
  try {
    // 模拟获取日记列表
    const diaries = [
      {
        id: '1',
        user_id: '1',
        title: '今天去了公园',
        content: '今天天气很好，和朋友一起去了公园，看到了很多美丽的花朵，还遇到了一只可爱的小猫咪。',
        mood: 'happy',
        created_at: '2026-04-23T08:00:00Z',
        updated_at: '2026-04-23T08:00:00Z'
      },
      {
        id: '2',
        user_id: '1',
        title: '旅行日记',
        content: '终于来到了梦寐以求的海边，海水很蓝，沙滩很软，心情超级好！',
        mood: 'excited',
        created_at: '2026-04-22T10:00:00Z',
        updated_at: '2026-04-22T10:00:00Z'
      }
    ];
    return new Response(JSON.stringify(diaries), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '获取日记列表失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleCreateDiary(request) {
  try {
    const data = await request.json();
    // 模拟创建日记
    return new Response(JSON.stringify({ success: true, diary: { id: '3', ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '创建日记失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleGetDiary(request, diaryId) {
  try {
    // 模拟获取单个日记
    const diary = {
      id: diaryId,
      user_id: '1',
      title: '今天去了公园',
      content: '今天天气很好，和朋友一起去了公园，看到了很多美丽的花朵，还遇到了一只可爱的小猫咪。',
      mood: 'happy',
      created_at: '2026-04-23T08:00:00Z',
      updated_at: '2026-04-23T08:00:00Z'
    };
    return new Response(JSON.stringify(diary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '获取日记失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleUpdateDiary(request, diaryId) {
  try {
    const data = await request.json();
    // 模拟更新日记
    return new Response(JSON.stringify({ success: true, diary: { id: diaryId, ...data, updated_at: new Date().toISOString() } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '更新日记失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDeleteDiary(request, diaryId) {
  try {
    // 模拟删除日记
    return new Response(JSON.stringify({ success: true, message: '删除日记成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '删除日记失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 评论 API 处理函数
async function handleGetComments(request, diaryId) {
  try {
    // 模拟获取评论列表
    const comments = [
      {
        id: '1',
        diary_id: diaryId,
        user_id: '2',
        content: '看起来很开心呢！',
        created_at: '2026-04-23T10:00:00Z'
      },
      {
        id: '2',
        diary_id: diaryId,
        user_id: '3',
        content: '下次一起去！',
        created_at: '2026-04-23T10:30:00Z'
      }
    ];
    return new Response(JSON.stringify(comments), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '获取评论列表失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleCreateComment(request, diaryId) {
  try {
    const data = await request.json();
    // 模拟创建评论
    return new Response(JSON.stringify({ success: true, comment: { id: '3', diary_id: diaryId, ...data, created_at: new Date().toISOString() } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '创建评论失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDeleteComment(request, commentId) {
  try {
    // 模拟删除评论
    return new Response(JSON.stringify({ success: true, message: '删除评论成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '删除评论失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 地图标记 API 处理函数
async function handleGetMarkers(request) {
  try {
    // 模拟获取地图标记
    const markers = [
      {
        id: '1',
        user_id: '1',
        lat: 39.9042,
        lng: 116.4074,
        name: '北京',
        created_at: '2026-04-20T08:00:00Z'
      },
      {
        id: '2',
        user_id: '1',
        lat: 31.2304,
        lng: 121.4737,
        name: '上海',
        created_at: '2026-04-21T10:00:00Z'
      }
    ];
    return new Response(JSON.stringify(markers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '获取地图标记失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleCreateMarker(request) {
  try {
    const data = await request.json();
    // 模拟创建地图标记
    return new Response(JSON.stringify({ success: true, marker: { id: '3', ...data, created_at: new Date().toISOString() } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '创建地图标记失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleGetMarker(request, markerId) {
  try {
    // 模拟获取单个地图标记
    const marker = {
      id: markerId,
      user_id: '1',
      lat: 39.9042,
      lng: 116.4074,
      name: '北京',
      created_at: '2026-04-20T08:00:00Z'
    };
    return new Response(JSON.stringify(marker), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '获取地图标记失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleUpdateMarker(request, markerId) {
  try {
    const data = await request.json();
    // 模拟更新地图标记
    return new Response(JSON.stringify({ success: true, marker: { id: markerId, ...data } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '更新地图标记失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDeleteMarker(request, markerId) {
  try {
    // 模拟删除地图标记
    return new Response(JSON.stringify({ success: true, message: '删除地图标记成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '删除地图标记失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 同步 API 处理函数
async function handleSync(request) {
  try {
    const data = await request.json();
    // 模拟同步逻辑
    return new Response(JSON.stringify({ success: true, message: '同步成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '同步失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleSyncStatus(request) {
  try {
    // 模拟同步状态
    return new Response(JSON.stringify({ success: true, status: '同步完成', last_sync: new Date().toISOString() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '获取同步状态失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}