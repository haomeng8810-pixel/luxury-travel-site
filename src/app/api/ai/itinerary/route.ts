import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// ============================================
// AI 行程生成 API
// 使用通义千问 (Qwen)
// 在 .env 中添加: DASHSCOPE_API_KEY=sk-xxx
// ============================================

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 });
  }

  const { destination, duration, budget, travelerType, travelers, interests, notes } = body;

  // 检查 API Key（去除可能的引号）
  let apiKey = process.env.DASHSCOPE_API_KEY || '';
  // 移除首尾引号（兼容 .env 格式）
  apiKey = apiKey.replace(/^["']|["']$/g, '').trim();
  
  if (!apiKey) {
    console.log('DASHSCOPE_API_KEY not set, returning demo data');
    return NextResponse.json(getDemoItinerary(body));
  }
  
  console.log('DASHSCOPE_API_KEY found, length:', apiKey.length);

  try {
    // 构建提示词
    const prompt = buildItineraryPrompt(body);

    console.log('Calling DashScope API...');

    // 调用通义千问 API
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-max',
        messages: [
          { role: 'system', content: 'You are a professional luxury travel planner. Generate detailed, personalized itineraries in JSON format.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    console.log('DashScope response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DashScope API error:', errorData);
      // 如果 API 调用失败，返回演示数据
      return NextResponse.json(getDemoItinerary(body));
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid DashScope response:', JSON.stringify(data));
      return NextResponse.json(getDemoItinerary(body));
    }

    const content = data.choices[0].message.content;
    const itinerary = JSON.parse(content);

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('AI itinerary generation error:', error);
    // 出错时返回演示数据
    return NextResponse.json(getDemoItinerary(body));
  }
}

function buildItineraryPrompt(data: any) {
  return `生成一个${data.duration}天的${data.destination}旅行行程。

要求：
- 出行人数：${data.travelers}人
- 出行类型：${data.travelerType}
- 预算范围：${data.budget}
- 兴趣爱好：${data.interests.join('、')}
- 特殊需求：${data.notes || '无'}

请以 JSON 格式返回，包含以下字段：
{
  "title": "行程标题（英文）",
  "titleCn": "行程标题（中文）",
  "summary": "行程概述（200字以内，中文）",
  "duration": ${data.duration},
  "travelers": ${data.travelers},
  "estimatedCost": "预估总费用（如：¥50,000-80,000）",
  "dailyPlan": [
    {
      "day": 1,
      "title": "当天标题",
      "description": "详细描述",
      "highlights": ["亮点1", "亮点2"],
      "accommodation": "住宿推荐",
      "meals": ["早餐", "午餐", "晚餐"]
    }
  ],
  "tips": ["旅行贴士1", "旅行贴士2"]
}`;
}

function getDemoItinerary(data: any) {
  const destNames: Record<string, string> = {
    'japan': '日本',
    'thailand': '泰国',
    'france': '法国',
    'italy': '意大利',
    'australia': '澳大利亚',
    'new-zealand': '新西兰',
    'maldives': '马尔代夫',
    'switzerland': '瑞士',
  };

  const destName = destNames[data.destination] || data.destination;
  const days = [];

  for (let i = 1; i <= data.duration; i++) {
    days.push({
      day: i,
      title: `Day ${i} - ${destName}探索`,
      description: `今天的行程包括参观当地著名景点，体验${data.interests?.[0] || '当地文化'}，品尝地道美食。`,
      highlights: ['景点A', '景点B', '特色体验'],
      accommodation: '当地精品酒店',
      meals: ['酒店早餐', '当地特色午餐', '米其林晚餐'],
    });
  }

  return {
    title: `${destName} ${data.duration}-Day Luxury Journey`,
    titleCn: `${destName}${data.duration}天奢华之旅`,
    summary: `这是一条为您量身定制的${destName}${data.duration}天行程，融合了${data.interests?.join('、') || '当地特色'}等元素，适合${data.travelerType || '情侣'}出行，预算约${data.budget || '待定'}。`,
    duration: data.duration,
    travelers: data.travelers,
    estimatedCost: `¥${data.travelers * 15000}-${data.travelers * 25000}`,
    dailyPlan: days,
    tips: [
      '建议提前预订机票和酒店',
      '购买旅行保险',
      '携带合适的衣物和必需品',
      '了解当地文化和礼仪',
    ],
  };
}
