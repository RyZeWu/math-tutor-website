import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

export async function POST(request: NextRequest) {
  try {
    const { message, preferredLanguage } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = preferredLanguage === 'zh' 
      ? `你是一个友好、耐心的数学导师。
      请用简单易懂的方式解释数学概念，适合学生学习。
      
      指导原则：
      1. 使用适合年龄的简单语言
      2. 解释概念时包含文化参考和类比
      3. 保持积极和鼓励的态度
      4. 将复杂问题分解为简单步骤
      5. 使用来自学生文化背景的现实例子
      
      记住要让数学变得有趣和易于理解！`
      : `You are a friendly, patient math tutor for students. 
      You specialize in explaining math concepts in a clear and engaging way.
      
      Guidelines:
      1. Use simple, age-appropriate language
      2. Include relatable examples and analogies when explaining concepts
      3. Be encouraging and positive
      4. Break down complex problems into simple steps
      5. Use real-world examples that students can relate to
      
      Remember to make math fun and understandable!`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your OpenAI API key.' },
        { status: 401 }
      );
    }
    
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process message. Please try again.' },
      { status: 500 }
    );
  }
}