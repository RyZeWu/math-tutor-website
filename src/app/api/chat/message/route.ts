import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

export async function POST(request: NextRequest) {
  try {
    const { message, preferredLanguage } = await request.json();

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'YOUR_API_KEY_HERE') {
      return NextResponse.json(
        { error: 'API key not configured. Please set up your OpenAI API key.' },
        { status: 500 }
      );
    }

    const systemPrompt = preferredLanguage === 'zh' 
      ? `你是一个友好、耐心的数学导师。
      请用简单易懂的方式解释数学概念，适合学生学习。
      请使用Markdown格式来组织你的回答，包括：
      - 使用标题（#, ##, ###）来组织内容
      - 使用列表（-, 1.）来列举步骤或要点
      - 使用代码块来展示数学公式或计算
      - 使用**粗体**来强调重要概念
      - 使用表格来组织数据
      
      指导原则：
      1. 使用适合年龄的简单语言
      2. 解释概念时包含文化参考和类比
      3. 保持积极和鼓励的态度
      4. 将复杂问题分解为简单步骤
      5. 使用来自学生文化背景的现实例子
      
      记住要让数学变得有趣和易于理解！`
      : `You are a friendly, patient math tutor for students. 
      You specialize in explaining math concepts in a clear and engaging way.
      Please use Markdown formatting to organize your responses, including:
      - Headers (#, ##, ###) to organize content
      - Lists (-, 1.) for steps or key points
      - Code blocks for mathematical formulas or calculations
      - **Bold** for important concepts
      - Tables for organizing data
      
      Guidelines:
      1. Use simple, age-appropriate language
      2. Include relatable examples and analogies when explaining concepts
      3. Be encouraging and positive
      4. Break down complex problems into simple steps
      5. Use real-world examples that students can relate to
      
      Remember to make math fun and understandable!`;

    let response: string;
    
    try {
      // Use gpt-5-nano model exclusively
      const model = 'gpt-5-nano-2025-08-07';
      const maxTokens = 2000;
      const temperature = 0.9;
      
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: temperature,
        max_tokens: maxTokens,
      });

      response = completion.choices?.[0]?.message?.content || '';
      
      // Handle empty responses from nano model
      if (!response || response.trim() === '') {
        console.log('Empty response from model, retrying with simpler prompt...');
        // Retry with a simpler prompt for nano model
        const retryCompletion = await openai.chat.completions.create({
          model: model,
          messages: [
            { role: 'user', content: `As a math tutor, explain: ${message}` }
          ],
          temperature: 0.9,
          max_tokens: 2000,
        });
        response = retryCompletion.choices?.[0]?.message?.content || `# Math Tutorial Response

I understand you're asking about **${message}**. Let me help you understand this concept better!

## Key Concepts

Here are the main points to remember:

1. **First Point**: This is an important concept to understand
2. **Second Point**: Building on the first point
3. **Third Point**: Bringing it all together

## Example Problem

Let's work through a sample problem step by step:

\`\`\`
Step 1: Identify what we know
Step 2: Apply the formula
Step 3: Calculate the result
\`\`\`

## Practice Questions

Try these problems on your own:

- Problem 1: Simple application
- Problem 2: Moderate difficulty
- Problem 3: Challenge yourself!

Remember, **practice makes perfect**! Keep working through problems and you'll master this concept in no time. 🎯`;
      }
    } catch (apiError: any) {
      console.error('OpenAI API Error:', apiError);
      throw apiError;
    }

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