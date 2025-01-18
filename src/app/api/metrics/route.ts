import { NextResponse } from "next/server";

export async function GET() {
  const metrics = await globalThis.metrics?.registry?.metrics();
  return NextResponse.json(metrics, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}