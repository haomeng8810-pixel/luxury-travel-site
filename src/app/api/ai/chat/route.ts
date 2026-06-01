import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// ============================================
// AI 客服聊天 API
// 使用通义千问 (Qwen)
// 在 .env 中添加: DASHSCOPE_API_KEY=sk-xxx
// ============================================

const SYSTEM_PROMPT = `你是一位专业的高端旅行客服助手，名为"旅行管家"。

你的职责：
1. 回答关于目的地、酒店、行程、价格、签证等问题
2. 提供专业的旅行建议
3. 帮助用户找到合适的行程
4. 引导用户提交咨询或预订

回答要求：
- 使用中文回复（除非用户用其他语言）
- 专业、友好、简洁
- 如果不确定，诚实告知并引导用户联系人工客服
- 不要编造不存在的信息
- 推荐行程时，可以提到网站上的行程页面`;

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 });
  }

  const { messages, sessionId } = body;

  // 检查 API Key（去除可能的引号）
  let apiKey = process.env.DASHSCOPE_API_KEY || '';
  apiKey = apiKey.replace(/^["']|["']$/g, '').trim();

  if (!apiKey) {
    return NextResponse.json({
      reply: getDemoReply(messages),
      sessionId: sessionId || `demo_${Date.now()}`,
    });
  }

  // 使用环境变量配置的 URL 和模型
  const baseUrl = (process.env.DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1').replace(/\/$/, '');
  const model = process.env.DASHSCOPE_MODEL || 'qwen-max';

  try {
    console.log('Chat API: calling DashScope', model, 'at', baseUrl);

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10), // 保留最近 10 条消息
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DashScope chat API error:', errorData);
      return NextResponse.json({
        reply: getDemoReply(messages),
        sessionId: sessionId || `chat_${Date.now()}`,
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回复。';

    return NextResponse.json({
      reply,
      sessionId: sessionId || `chat_${Date.now()}`,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({
      reply: getDemoReply(messages),
      sessionId: sessionId || `chat_${Date.now()}`,
    });
  }
}

function getDemoReply(messages: any[]) {
  const lastMessage = messages[messages.length - 1]?.content || '';
  const lower = lastMessage.toLowerCase();

  if (lower.includes('日本') || lower.includes('japan')) {
    return '日本是我们非常受欢迎的目的地！推荐您查看我们的东京-京都经典行程，或者使用 AI 行程生成器定制专属行程。您想了解哪些方面的信息呢？';
  }
  if (lower.includes('价格') || lower.includes('多少钱') || lower.includes('预算')) {
    return '我们的行程价格根据出行人数、日期和定制需求有所不同。一般高端定制行程人均预算在 ¥20,000-¥50,000 起。您可以使用 AI 行程生成器获取更精准的报价！';
  }
  if (lower.includes('签证') || lower.includes('visa')) {
    return '不同目的地签证要求不同。日本需要办理旅游签证，我们可以协助提供相关材料清单。建议您提前 1-2 个月开始办理。';
  }
  if (lower.includes('你好') || lower.includes('hi') || lower.includes('hello')) {
    return '您好！我是您的 AI 旅行管家，很高兴为您服务。请问有什么可以帮助您的？您可以问我关于目的地、行程、价格等问题。';
  }
  if (lower.includes('推荐') || lower.includes('行程')) {
    return '我们有多条精选行程，包括日本经典游、泰国海岛游、欧洲文化游等。您也可以使用 AI 行程生成器，告诉我您的偏好，我会为您定制专属行程！';
  }

  return '感谢您的咨询！作为 AI 旅行管家，我可以为您介绍目的地信息、行程推荐、签证须知等。如需更详细的定制服务，建议您提交咨询表单，我们的旅行专家会尽快联系您。';
}
