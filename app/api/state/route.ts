import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const STATE_FILE = path.join(process.cwd(), 'data', 'app-state.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.dirname(STATE_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export async function GET() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // Return empty state if file doesn't exist
    return NextResponse.json({});
  }
}

export async function POST(request: Request) {
  try {
    const state = await request.json();
    await ensureDataDir();
    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save state' }, { status: 500 });
  }
}
