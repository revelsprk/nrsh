import { NextResponse } from 'next/server';
import { getSubtitles } from 'youtube-captions-scraper';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
        return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
    }

    try {
        const subtitles = await getSubtitles({
            videoID: videoId,
            lang: 'en', // Default to English for now
        });

        return NextResponse.json({ subtitles });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch subtitles', details: String(error) }, { status: 500 });
    }
}