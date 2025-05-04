import { NextResponse } from 'next/server';
import { getSubtitles } from 'youtube-captions-scraper';

const SUPPORTED_LANGS = ['en', 'ja', 'zh-Hans'];

type Subtitle = {
    start: number;
    dur: number;
    text: string;
};

type SubtitlesResponse = {
    [lang: string]: Subtitle[];
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
        return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
    }

    const subtitles: SubtitlesResponse = {};

    for (const lang of SUPPORTED_LANGS) {
        try {
            const result = await getSubtitles({
                videoID: videoId,
                lang,
            });

            if (result.length > 0) {
                subtitles[lang] = result;
            }
        } catch {
            // 該当言語の字幕が取得できなかった場合は無視
        }
    }

    if (Object.keys(subtitles).length === 0) {
        return NextResponse.json({ error: 'No subtitles found' }, { status: 404 });
    }

    return NextResponse.json({ subtitles });
}