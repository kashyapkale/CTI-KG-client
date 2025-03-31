import { useState } from 'react'
import dynamic from 'next/dynamic'
import UploadPanel from '@/components/UploadPanel'
import { TripletFile } from '@/types'
import { convertTripletsToGraphData } from '@/lib/convertToGraph3D'

// Dynamically import to prevent SSR issues
const ForceGraph3DViewer = dynamic(
    () => import('@/components/ForceGraph3DViewer'),
    { ssr: false }
)

export default function HomePage() {
    // Explicitly typing state for nodes and links
    const [nodes, setNodes] = useState<{ id: string; class: string }[]>([])
    const [links, setLinks] = useState<{ source: string; target: string; label: string }[]>([])

    const handleDataLoad = (files: TripletFile[]) => {
        const allTriplets = files.flatMap((file) => file.IE.triplets)
        const graph = convertTripletsToGraphData(allTriplets)
        setNodes(graph.nodes) // Set nodes with correct type
        setLinks(graph.links) // Set links with correct type
    }

    return (
        <main className="min-h-screen p-8 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">🧠 CTI Knowledge Graph 3D</h1>
            <UploadPanel onDataLoaded={handleDataLoad} />
            {nodes.length > 0 && <ForceGraph3DViewer nodes={nodes} links={links} />}
        </main>
    )
}
