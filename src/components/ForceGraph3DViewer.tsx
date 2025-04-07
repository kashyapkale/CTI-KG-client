'use client';
import {
    useRef,
    useImperativeHandle,
    forwardRef,
    useEffect,
    Ref,
} from 'react';
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import SpriteText from 'three-spritetext';

type Node = {
    id: string;
    class: string;
    x?: number;
    y?: number;
    z?: number;
};

type Link = {
    source: string;
    target: string;
    label: string;
};

export type GraphViewerRef = {
    focusOnNode: (id: string) => void;
};

export type Props = {
    nodes: Node[];
    links: Link[];
    focusNodeId?: string;
};

const ForceGraph3DViewer = forwardRef<GraphViewerRef, Props>(
    ({ nodes, links, focusNodeId }, ref: Ref<GraphViewerRef>) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const forceGraphInstanceRef = useRef<ForceGraph3DInstance | null>(null);

        useEffect(() => {
            if (!containerRef.current) return;

            // Initialize the graph
            forceGraphInstanceRef.current = ForceGraph3D()(containerRef.current)
                .graphData({ nodes, links })
                .nodeAutoColorBy('class')
                .linkLabel((link: Link) => link.label)
                .linkDirectionalArrowLength(3)
                .linkDirectionalArrowRelPos(1)
                .linkOpacity(0.6)
                .linkWidth(1)
                .nodeThreeObject((node: Node) => {
                    const sprite = new SpriteText(node.id);
                    sprite.color = 'white';
                    sprite.textHeight = 6;
                    return sprite;
                });

            // Add onNodeClick event listener to focus on clicked node
            // @ts-expect-error – unsupported type from library
            forceGraphInstanceRef.current.onNodeClick((node: Node) => {
                if (!node) return;
                const distance = 120;
                const distRatio =
                    1 + distance / Math.hypot(node.x ?? 0, node.y ?? 0, node.z ?? 0);

                forceGraphInstanceRef.current?.cameraPosition(
                    {
                        x: (node.x ?? 0) * distRatio,
                        y: (node.y ?? 0) * distRatio,
                        z: (node.z ?? 0) * distRatio,
                    },
                    { x: node.x ?? 0, y: node.y ?? 0, z: node.z ?? 0 },
                    3000
                );
            });
        }, [nodes, links]);

        // Expose imperative handle if needed
        useImperativeHandle(ref, () => ({
            focusOnNode: (id: string) => {
                const node = nodes.find((n) => n.id === id);
                if (!node || !forceGraphInstanceRef.current) return;

                const distance = 120;
                const distRatio =
                    1 + distance / Math.hypot(node.x ?? 0, node.y ?? 0, node.z ?? 0);

                forceGraphInstanceRef.current.cameraPosition(
                    {
                        x: (node.x ?? 0) * distRatio,
                        y: (node.y ?? 0) * distRatio,
                        z: (node.z ?? 0) * distRatio,
                    },
                    { x: node.x ?? 0, y: node.y ?? 0, z: node.z ?? 0 },
                    3000
                );
            },
        }));

        // Automatically focus on a node if the focusNodeId prop changes
        useEffect(() => {
            if (!focusNodeId || !forceGraphInstanceRef.current) return;
            const node = nodes.find((n) => n.id === focusNodeId);
            if (!node) return;
            const distance = 120;
            const distRatio =
                1 + distance / Math.hypot(node.x ?? 0, node.y ?? 0, node.z ?? 0);

            forceGraphInstanceRef.current.cameraPosition(
                {
                    x: (node.x ?? 0) * distRatio,
                    y: (node.y ?? 0) * distRatio,
                    z: (node.z ?? 0) * distRatio,
                },
                { x: node.x ?? 0, y: node.y ?? 0, z: node.z ?? 0 },
                3000
            );
        }, [focusNodeId, nodes]);

        return <div ref={containerRef} className="w-full h-[600px] bg-black" />;
    }
);

ForceGraph3DViewer.displayName = 'ForceGraph3DViewer';
export default ForceGraph3DViewer;
