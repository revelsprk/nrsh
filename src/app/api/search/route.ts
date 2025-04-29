import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
        return NextResponse.json({ error: "クエリが必要です" }, { status: 400 });
    }

    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
        q
        )}&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await res.json();
    return NextResponse.json(data);
}