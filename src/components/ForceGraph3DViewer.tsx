'use client'
import { useEffect, useRef } from 'react'
import SpriteText from 'three-spritetext'
import ForceGraph3D from '3d-force-graph'

// Node and Link types for clarity
type Node = {
    id: string
    class: string
}

type Link = {
    source: string
    target: string
    label: string
}

type Props = {
    nodes: Node[]
    links: Link[]
}

export default function ForceGraph3DViewer({ nodes, links }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current

        // Fix TS: safely cast to avoid TS2348 error
        const createForceGraph = ForceGraph3D as any

        const Graph = createForceGraph()(container)
            .graphData({ nodes, links })
            .nodeAutoColorBy('class')
            .linkLabel((link: any) => link.label)
            .linkDirectionalArrowLength(3)
            .linkDirectionalArrowRelPos(1)
            .linkOpacity(0.6)
            .linkWidth(1)
            .nodeThreeObject((node: any) => {
                const sprite = new SpriteText(node.id)
                sprite.color = 'white'
                sprite.textHeight = 6
                return sprite
            })
            .onNodeClick((node: any) => {
                const distance = 120
                const distRatio =
                    1 + distance / Math.hypot(node.x || 0, node.y || 0, node.z || 0)

                Graph.cameraPosition(
                    {
                        x: (node.x || 0) * distRatio,
                        y: (node.y || 0) * distRatio,
                        z: (node.z || 0) * distRatio,
                    },
                    node,
                    3000
                )
            })

        // Cleanup: clear container on unmount
        return () => {
            container.innerHTML = ''
        }
    }, [nodes, links])

    return (
        <div
            ref={containerRef}
            className="w-full h-[600px] border rounded shadow-inner bg-black"
        />
    )
}
