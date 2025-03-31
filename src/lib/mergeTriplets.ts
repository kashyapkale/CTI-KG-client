import { GraphNode, GraphEdge, TripletFile } from '@/types'

export function mergeTriplets(files: TripletFile[]): {
    nodes: GraphNode[]
    edges: GraphEdge[]
} {
    const nodeSet = new Map<string, GraphNode>()
    const edgeSet = new Set<string>()

    const edges: GraphEdge[] = []

    for (const file of files) {
        for (const triplet of file.IE.triplets) {
            const { subject, relation, object } = triplet

            if (!nodeSet.has(subject)) {
                nodeSet.set(subject, { id: subject, label: subject })
            }
            if (!nodeSet.has(object)) {
                nodeSet.set(object, { id: object, label: object })
            }

            const edgeId = `${subject}::${relation}::${object}`
            if (!edgeSet.has(edgeId)) {
                edges.push({
                    id: edgeId,
                    source: subject,
                    target: object,
                    label: relation,
                })
                edgeSet.add(edgeId)
            }
        }
    }

    return {
        nodes: Array.from(nodeSet.values()),
        edges,
    }
}
