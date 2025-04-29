"use client"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const WatchClient = dynamic(() => import("./WatchClient"), { ssr: false });

export default function Page() {
    return (
        <>
            <Header />
            <WatchClient />
            <Footer />
        </>
    );
}
