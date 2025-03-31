export type Triplet = {
    subject: string
    relation: string
    object: string
}

export type TripletFile = {
    IE: {
        triplets: Triplet[]
        triples_count?: number
    }
}

export type GraphNode = {
    id: string
    label: string
}

export type GraphEdge = {
    id: string
    source: string
    target: string
    label: string
}
