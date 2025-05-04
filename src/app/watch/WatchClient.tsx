"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { decode } from "he";

type Subtitle = { start: number; dur: number; text: string };
type SubtitlesMap = { [lang: string]: Subtitle[] };

type YouTubeVideo = {
    id: string;
    snippet: {
        title: string;
        description: string;
        thumbnails: {
            medium: {
                url: string;
            };
        };
    };
    statistics: {
        viewCount: string;
    };
};

export default function WatchClient() {
    const searchParams = useSearchParams();
    const videoId = searchParams.get("v");

    const [video, setVideo] = useState<YouTubeVideo | null>(null);
    const [subtitlesMap, setSubtitlesMap] = useState<SubtitlesMap>({});
    const [selectedLang, setSelectedLang] = useState<string | null>(null);
    const [subtitlesError, setSubtitlesError] = useState(false);

    // 字幕の取得
    useEffect(() => {
        const fetchSubtitles = async () => {
            if (!videoId) return;
            try {
                const res = await axios.get(`/api/captions?videoId=${videoId}`);
                setSubtitlesMap(res.data.subtitles);
                const langs = Object.keys(res.data.subtitles);
                if (langs.length > 0) {
                    setSelectedLang(langs[0]); // 最初の言語を選択
                }
                setSubtitlesError(false);
            } catch {
                setSubtitlesError(true);
            }
        };
        fetchSubtitles();
    }, [videoId]);

    // 動画の情報取得
    useEffect(() => {
        if (!videoId) return;

        const fetchVideoDetails = async () => {
            try {
                const res = await axios.get(
                    `https://www.googleapis.com/youtube/v3/videos`,
                    {
                        params: {
                            part: "snippet,statistics",
                            id: videoId,
                            key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
                        },
                    }
                );
                if (res.data.items.length > 0) {
                    setVideo(res.data.items[0]);
                }
            } catch (error) {
                console.error("動画情報の取得に失敗しました", error);
            }
        };

        fetchVideoDetails();
    }, [videoId]);

    if (!videoId) {
        return <div className="text-center mt-10">動画IDが指定されていません。</div>;
    }

    if (!video) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    const currentSubtitles = selectedLang ? subtitlesMap[selectedLang] : [];

    return (
        <div className="md:w-3/4 mx-auto md:mt-8 flex flex-col md:flex-row gap-4">
            {/* YouTube 動画埋め込み */}
            <div className="md:w-1/2">
                <div className="aspect-video">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    />
                </div>
                <div className="m-2 md:m-0 md:mt-4">
                    <h1 className="text-xl font-bold mb-2">{decode(video.snippet.title)}</h1>

                    <p className="text-sm text-gray-500 mb-2">
                        {Number(video.statistics.viewCount).toLocaleString()} views
                    </p>

                    <div className="hidden md:flex max-h-48 bg-gray-200/50 rounded-md p-4 overflow-y-auto">
                        <p
                            className="text-gray-600 whitespace-pre-line"
                            dangerouslySetInnerHTML={{
                                __html: video.snippet.description.replace(
                                    /(https?:\/\/[^\s]+)/g,
                                    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>'
                                ),
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* 字幕表示エリア */}
            <div className="md:w-1/2">
                {/* 字幕内容 */}
                <div className="p-6 rounded-md max-h-96 overflow-y-auto space-y-2">
                <div className="mb-4 sticky top-0">
                    {Object.keys(subtitlesMap).length > 0 && (
                        <select
                            className="border bg-gray-50 rounded-md px-2 py-1"
                            value={selectedLang ?? ""}
                            onChange={(e) => setSelectedLang(e.target.value)}
                        >
                            {Object.keys(subtitlesMap).map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                    {subtitlesError ? (
                        <p className="text-gray-500">字幕が取得できませんでした。</p>
                    ) : !currentSubtitles || currentSubtitles.length === 0 ? (
                        <p className="text-gray-500">字幕が見つかりませんでした。</p>
                    ) : (
                        currentSubtitles.map((line, index) => (
                            <p key={index} className="text-xl">
                                {line.text}
                            </p>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}