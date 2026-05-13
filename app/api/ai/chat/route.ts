import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { messages, context } = await request.json();
    const apiKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'AI API Key not configured' }, { status: 500 });
    }

    // Mocking Claude API response for development if key is placeholder
    if (apiKey === 'YOUR_API_KEY_HERE') {
      return NextResponse.json({ 
        content: `I have reviewed your financial context. Your current net worth is ${context.netWorth} and you have a tax-free draw capacity of ${context.noteBalance}. My strategic advice is to maximize your §508(c)(1)(A) contributions to offset the upcoming quarterly tax liability.`
      });
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages,
        system: `You are the Family Wealth AI Advisor. Use the following context to provide strategic estate and tax advice: ${JSON.stringify(context)}`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      }
    );

    return NextResponse.json({ content: response.data.content[0].text });
  } catch (error: any) {
    console.error('AI Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
