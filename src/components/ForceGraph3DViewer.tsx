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
//@ts-expect-error - Null P
import * as THREE from 'three';

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
            // @ts-expect-error - containerRef
            forceGraphInstanceRef.current = ForceGraph3D()(containerRef.current)
                .graphData({ nodes, links })
                .nodeAutoColorBy('class')
                .linkLabel((link: Link) => link.label)
                .linkDirectionalArrowLength(3)
                .linkDirectionalArrowRelPos(1)
                .linkOpacity(0.5)
                .linkWidth(1)
                .linkCurvature(0.25)
                .backgroundColor('#00000000')
                .linkDirectionalParticles(2)
                .linkDirectionalParticleWidth(2)
                .linkDirectionalParticleSpeed(0.005)
                .nodeThreeObjectExtend(true)
                .nodeThreeObject((node: Node) => {
                    const group = new THREE.Group();

                    const sphere = new THREE.Mesh(
                        new THREE.SphereGeometry(3),
                        new THREE.MeshStandardMaterial({
                            color: getNodeColor(node.class),
                            emissive: getNodeColor(node.class),
                            emissiveIntensity: 0.6,
                            roughness: 0.4,
                        })
                    );

                    const label = new SpriteText(node.id);
                    label.color = 'white';
                    label.textHeight = 6;
                    //@ts-expect-error - Null P
                    label.position.y = 5;

                    group.add(sphere);
                    group.add(label);

                    return group;
                });

            // 👇 Make canvas background transparent to show the galaxy
            //@ts-expect-error - Null P
            const renderer = forceGraphInstanceRef.current.renderer();
            renderer.setClearColor(0x000000, 0);
            renderer.domElement.style.background = 'transparent';

            // Add onNodeClick event listener to focus on clicked node
            // @ts-expect-error – unsupported type from library
            forceGraphInstanceRef.current.onNodeClick((node: Node) => {
                if (!node) return;
                focusCameraOnNode(node);
            });

            // Auto rotate
            //@ts-expect-error - Null P
            const controls = forceGraphInstanceRef.current.controls();
            //@ts-expect-error - Null P
            controls.autoRotate = true;
            //@ts-expect-error - Null P
            controls.autoRotateSpeed = 1.5;

            // Lighting
            // @ts-expect-error - Null P
            const scene = forceGraphInstanceRef.current.scene();
            scene.add(new THREE.AmbientLight(0xffffff, 0.5));
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(0, 100, 100);
            scene.add(directionalLight);
        }, [nodes, links]);

        // Expose imperative handle if needed
        useImperativeHandle(ref, () => ({
            focusOnNode: (id: string) => {
                const node = nodes.find((n) => n.id === id);
                if (!node || !forceGraphInstanceRef.current) return;
                focusCameraOnNode(node);
            },
        }));

        // Automatically focus on a node if the focusNodeId prop changes
        useEffect(() => {
            if (!focusNodeId || !forceGraphInstanceRef.current) return;
            const node = nodes.find((n) => n.id === focusNodeId);
            if (!node) return;
            focusCameraOnNode(node);
        }, [focusNodeId, nodes]);

        const focusCameraOnNode = (node: Node) => {
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
        };

        const getNodeColor = (nodeClass: string): string => {
            switch (nodeClass) {
                case 'vulnerability':
                    return '#ff6b6b';
                case 'exploit':
                    return '#feca57';
                case 'actor':
                    return '#54a0ff';
                case 'tool':
                    return '#1dd1a1';
                case 'technique':
                    return '#5f27cd';
                default:
                    return '#c8d6e5';
            }
        };

        return (
            <div
                ref={containerRef}
                className="w-full h-[600px]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("/galaxy-bg-3.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
        );
    }
);

ForceGraph3DViewer.displayName = 'ForceGraph3DViewer';
export default ForceGraph3DViewer;
