import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, studentId, preferredLanguage } = await request.json();

    const systemPrompt = `You are a friendly, patient math tutor for children. 
    You specialize in explaining math concepts using cultural analogies and examples that are familiar to the student.
    The student's preferred language is ${preferredLanguage || 'English'}.
    
    Guidelines:
    1. Use simple, age-appropriate language
    2. Include cultural references and analogies when explaining concepts
    3. Be encouraging and positive
    4. Break down complex problems into simple steps
    5. Use real-world examples from the student's cultural background
    6. If the message is in a non-English language, detect it and respond appropriately
    
    Remember to make math fun and relatable!`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    const culturalContext = {
      analogies: [],
      culturalReferences: [],
      examples: [`If you have ${Math.floor(Math.random() * 10) + 1} traditional dishes to share...`],
    };

    return NextResponse.json({
      response,
      culturalContext,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}