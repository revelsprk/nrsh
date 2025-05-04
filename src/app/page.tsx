"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Input from "@/components/ui/Input";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { decode } from "he";
import Footer from "@/components/Footer";
import Link from "next/link";

type YouTubeVideo = {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);

  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await axios.get("/api/search", {
        params: { q: query },
      });
      setVideos(res.data.items);
    } catch (error) {
      console.error("検索エラー:", error);
    }
  };

  return (
    <div>
      <Header />

      <div className="md:w-3/4 mx-4 md:mx-auto mt-8 flex items-center">
        <Input icon={<FiSearch />} placeholder="YouTubeで動画を検索する" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-r-none" />
        <Button onClick={handleSearch} className="rounded-l-none rounded-r-md">検索</Button>
      </div>

      <div className="md:w-3/4 mx-auto mt-8">
      {videos.length === 0 ? (
        <Image src="/search-pana.svg" alt="search illustration" width={100} height={100} className="md:w-3/4 w-full select-none opacity-50 mx-auto" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((video: YouTubeVideo) => (
            <div key={video.id.videoId}>
              <Link href={`/watch?v=${video.id.videoId}`}>
                <Image src={video.snippet.thumbnails.medium.url} alt="thumbnail" width={100} height={100} className="w-full max-w-md md:rounded-md"/>
                <div className="mx-2"><h2 className="font-semibold mt-2">{decode(video.snippet.title)}</h2></div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>

      <Footer />
    </div>
  );
}
