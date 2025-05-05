"use client"
import Header from '@/components/Header';
import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone/esm/vis-network';

export default function Tree() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            const nodes = [
                { id: 1, label: 'happy', color: { background: '#ffcc00' } },  // 親単語
                { id: 2, label: 'happiness', color: { background: '#ff9900' } }, // 名詞形
                { id: 3, label: 'happily', color: { background: '#ff9900' } },   // 副詞形
                { id: 4, label: 'unhappy', color: { background: '#ff6666' } },   // 反義語
                { id: 5, label: 'joy', color: { background: '#99cc00' } },       // 類義語
                { id: 6, label: 'cheerful', color: { background: '#99cc00' } },   // 類義語
                { id: 7, label: 'delighted', color: { background: '#99cc00' } },  // 類義語
                { id: 8, label: 'content', color: { background: '#99cc00' } },    // 類義語
                { id: 9, label: 'sad', color: { background: '#ff6666' } },       // 反義語
                { id: 10, label: 'gloomy', color: { background: '#ff6666' } },   // 反義語
            ];

            const edges = [
                { from: 1, to: 2 }, // happy -> happiness
                { from: 1, to: 3 }, // happy -> happily
                { from: 1, to: 4 }, // happy -> unhappy (反義語)
                { from: 1, to: 5 }, // happy -> joy (類義語)
                { from: 1, to: 6 }, // happy -> cheerful (類義語)
                { from: 1, to: 7 }, // happy -> delighted (類義語)
                { from: 5, to: 8 }, // joy -> content
                { from: 4, to: 9 }, // unhappy -> sad
                { from: 9, to: 10 }, // sad -> gloomy
            ];

            const data = { nodes, edges };

            const options = {
                layout: {
                    hierarchical: {
                        direction: 'UD',
                        sortMethod: 'directed',
                    },
                },
                nodes: {
                    shape: 'box',
                },
                edges: {
                    arrows: 'to',
                },
            };

            new Network(containerRef.current, data, options);
        }
    }, []);

    return (
        <div>
            <Header />
            <div className="md:w-1/2 mx-auto md:mt-8 p-4 md:p-0">
                <h1 className="text-2xl font-semibold">Root</h1>
                <div ref={containerRef} className="h-96 border rounded-md mt-2 shadow-md" />
            </div>
        </div>
    );
}
