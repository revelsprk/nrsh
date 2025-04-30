"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { decode } from "he";

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
};

export default function WatchClient() {
    const searchParams = useSearchParams();
    const videoId = searchParams.get("v");

    const [video, setVideo] = useState<YouTubeVideo | null>(null);
    const [subtitles, setSubtitles] = useState<{ start: number; dur: number; text: string }[]>([]);

    useEffect(() => {
        const fetchSubtitles = async () => {
            if (!videoId) return;
            try {
                const res = await axios.get(`/api/captions?videoId=${videoId}`);
                setSubtitles(res.data.subtitles);
            } catch (err) {
                console.error("字幕の取得に失敗しました", err);
            }
        };
        fetchSubtitles();
    }, [videoId]);

    useEffect(() => {
        if (!videoId) return;

        const fetchVideoDetails = async () => {
            try {
            const res = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos`,
            {
                params: {
                    part: "snippet",
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
        return <div className="text-center mt-10">読み込み中...</div>;
    }

    return (
        <div className="md:w-3/4 mx-auto md:mt-8 flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2">
                <div className="aspect-video">
                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
                </div>
                <div className="m-2 md:m-0 md:mt-4">
                    <h1 className="text-xl font-bold mb-2">{decode(video.snippet.title)}</h1>
                    <div className="hidden md:flex max-h-48 bg-gray-200/50 rounded-md p-4 overflow-y-auto"><p className="text-gray-600 whitespace-pre-line" dangerouslySetInnerHTML={{__html: video.snippet.description.replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>'),}}/></div>
                </div>
            </div>
            <div className="md:w-1/2">
                <div className="p-8 rounded-md max-h-96 overflow-y-auto space-y-2">
                    {subtitles.length === 0 ? (
                        <p className="text-gray-500">字幕が見つかりませんでした。</p>
                    ) : (
                        subtitles.map((line, index) => (
                            <p key={index} className="text-lg">
                                {line.text}
                            </p>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}