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

type Props = {
    nodes: Node[];
    links: Link[];
};

const ForceGraph3DViewer = forwardRef<GraphViewerRef, Props>(
    ({ nodes, links }, ref: Ref<GraphViewerRef>) => {
        const containerRef = useRef<HTMLDivElement>(null);
        // This is the ref for the actual ForceGraph3D instance:
        const forceGraphInstanceRef = useRef<ForceGraph3DInstance | null>(null);

        useEffect(() => {
            if (!containerRef.current) return;

            // @ts-expect-error ForceGraph3D has a callable signature not fully typed
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
        }, [nodes, links]);

        useImperativeHandle(ref, () => ({
            focusOnNode: (id: string) => {
                const node = nodes.find((n) => n.id === id);
                if (!node || !forceGraphInstanceRef.current) return;

                // Adjust distance and camera as needed
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

        return <div ref={containerRef} className="w-full h-[600px] bg-black" />;
    }
);

ForceGraph3DViewer.displayName = 'ForceGraph3DViewer';
export default ForceGraph3DViewer;
