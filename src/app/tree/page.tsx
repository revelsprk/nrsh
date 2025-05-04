"use client"
import Header from '@/components/Header';
import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone/esm/vis-network';

export default function Tree() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            const nodes = [
                { id: 1, label: 'Root' },
                { id: 2, label: 'Child 1' },
                { id: 3, label: 'Child 2' },
                { id: 4, label: 'Grandchild 1' },
            ];

            const edges = [
                { from: 1, to: 2 },
                { from: 1, to: 3 },
                { from: 2, to: 4 },
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
            <div className="md:w-1/2 mx-auto mt-8">
                <h1 className="text-2xl font-semibold">Root</h1>
                <div ref={containerRef} className="h-96 border rounded-md mt-2 shadow-md" />
            </div>
        </div>
    );
}
