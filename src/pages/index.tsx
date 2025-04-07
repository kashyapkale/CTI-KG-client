'use client';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import QueryBar from '@/components/QueryBar';
import { TripletFile } from '@/types';
import { convertTripletsToGraphData } from '@/lib/convertToGraph3D';
import type { GraphViewerRef } from '@/components/ForceGraph3DViewer';
import Fuse from 'fuse.js';
import ForceGraph3DViewerWithRef from '@/components/ForceGraph3DViewerWithRef';

export default function HomePage() {
    const [nodes, setNodes] = useState<{ id: string; class: string }[]>([]);
    const [links, setLinks] = useState<{ source: string; target: string; label: string }[]>([]);
    const [readyToRender, setReadyToRender] = useState(false);
    const [focusNodeId, setFocusNodeId] = useState<string | undefined>(undefined);
    const graphRef = useRef<GraphViewerRef>(null);

    // Simulate a short delay before rendering (if needed)
    useEffect(() => {
        const timer = setTimeout(() => {
            setReadyToRender(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const res = await fetch('/data/index.json');
                const filenames: string[] = await res.json();

                const fileFetches = filenames.map(async (name) => {
                    try {
                        const res = await fetch(`/data/${name}`);
                        if (!res.ok) throw new Error(`File not found: ${name}`);

                        const text = await res.text();
                        if (text.trim().startsWith('<')) {
                            console.warn(`Skipping ${name} — HTML returned instead of JSON`);
                            return null;
                        }

                        const json = JSON.parse(text);
                        if (!json.IE?.triplets?.length) {
                            console.warn(`Skipping ${name} — invalid triplet structure`);
                            return null;
                        }

                        return json as TripletFile;
                    } catch (err) {
                        console.warn(`Failed to load or parse ${name}:`, err);
                        return null;
                    }
                });

                const allFiles = (await Promise.all(fileFetches)).filter(Boolean) as TripletFile[];
                const allTriplets = allFiles.flatMap((file) => file.IE.triplets);

                // Convert triplets into graph data
                const graph = convertTripletsToGraphData(allTriplets);
                setNodes(graph.nodes);
                setLinks(graph.links);
            } catch (err) {
                console.error('Failed to load index.json or initial graph:', err);
            }
        };

        loadInitialData();
    }, []);

    const handleDataLoad = (files: TripletFile[]) => {
        const newTriplets = files.flatMap((file) => file.IE.triplets);
        const newGraph = convertTripletsToGraphData(newTriplets);

        // Merge nodes without duplicates
        const mergedNodes = [
            ...nodes,
            ...newGraph.nodes.filter((n) => !nodes.find((x) => x.id === n.id)),
        ];

        // Merge links without duplicates
        const mergedLinks = [
            ...links,
            ...newGraph.links.filter(
                (l) =>
                    !links.find(
                        (x) =>
                            x.source === l.source && x.target === l.target && x.label === l.label
                    )
            ),
        ];

        setNodes(mergedNodes);
        setLinks(mergedLinks);
    };

    const handleSearch = (query: string) => {
        const fuse = new Fuse(nodes, {
            keys: ['id', 'class'],
            threshold: 0.3,
        });

        const results = fuse.search(query);
        if (results.length > 0) {
            const matchedId = results[0].item.id;
            // Instead of calling focusOnNode imperatively,
            // we update the state so that the graph component
            // re-renders (or reacts) and focuses on the matched node.
            setFocusNodeId(matchedId);
        } else {
            alert('No match found for: ' + query);
        }
    };

    if (!readyToRender) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>CTI Knowledge Graph</title>
            </Head>

            <Header />

            <div className="flex h-[calc(100vh-64px)] overflow-hidden">
                <Sidebar onUpload={handleDataLoad} />

                <div className="flex-1 flex flex-col bg-gray-100 overflow-y-auto">
                    <div className="flex justify-center p-8">
                        <div className="w-full max-w-6xl">
                            {nodes.length > 0 && (
                                <div className="rounded overflow-hidden bg-black h-[600px]">
                                    <ForceGraph3DViewerWithRef
                                        ref={graphRef}
                                        nodes={nodes}
                                        links={links}
                                        focusNodeId={focusNodeId}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center mb-10">
                        <QueryBar onSearch={handleSearch} />
                    </div>
                </div>
            </div>
        </>
    );
}
