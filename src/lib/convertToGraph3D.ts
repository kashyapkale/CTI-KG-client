export function convertTripletsToGraphData(triplets: {
    subject: string
    relation: string
    object: string
}[]) {
    const nodeMap = new Map<string, { id: string; class: string }>()
    const links: { source: string; target: string; label: string }[] = []

    triplets.forEach(({ subject, relation, object }) => {
        if (!nodeMap.has(subject)) {
            nodeMap.set(subject, { id: subject, class: 'Unknown' })
        }
        if (!nodeMap.has(object)) {
            nodeMap.set(object, { id: object, class: 'Unknown' })
        }
        links.push({ source: subject, target: object, label: relation })
    })

    return {
        nodes: Array.from(nodeMap.values()),
        links,
    }
}
