'use client'
import React, { useEffect, useRef } from 'react'
import cytoscape, { Core } from 'cytoscape'
import { GraphNode, GraphEdge } from '@/types'

type Props = {
    nodes: GraphNode[]
    edges: GraphEdge[]
}

export default function GraphViewer({ nodes, edges }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const cyRef = useRef<Core | null>(null)

    useEffect(() => {
        if (!containerRef.current || nodes.length === 0) return

        const timeout = setTimeout(() => {
            requestAnimationFrame(() => {
                if (!containerRef.current) return

                const cy = cytoscape({
                    container: containerRef.current!,
                    elements: [
                        ...nodes.map((node) => ({
                            data: { id: node.id, label: node.label },
                        })),
                        ...edges.map((edge) => ({
                            data: {
                                id: edge.id,
                                source: edge.source,
                                target: edge.target,
                                label: edge.label,
                            },
                        })),
                    ],
                    style: [
                        {
                            selector: 'node',
                            style: {
                                label: 'data(label)',
                                'background-color': '#10b981', // emerald-500
                                'border-width': 2,
                                'border-color': '#064e3b',     // emerald-900
                                width: 60,
                                height: 60,
                                color: '#fff',
                                'text-valign': 'center',
                                'text-halign': 'center',
                                'font-size': '12px',
                                'text-outline-color': '#10b981',
                                'text-outline-width': '2px',
                            },
                        },
                        {
                            selector: 'edge',
                            style: {
                                width: 2,
                                'line-color': '#94a3b8',
                                'target-arrow-color': '#94a3b8',
                                'target-arrow-shape': 'triangle',
                                'curve-style': 'bezier',
                                label: 'data(label)',
                                'font-size': '10px',
                                'text-background-color': '#fff',
                                'text-background-opacity': 1,
                                'text-background-padding': '2px',
                            },
                        },
                    ],
                    layout: {
                        name: 'cose',
                        animate: true,
                    },
                })

                cy.ready(() => {
                    console.log('[GraphViewer] Graph elements:', cy.elements().length)
                    cy.elements().forEach((el) => console.log(el.data()))

                    // Force visibility
                    cy.zoom(1)
                    cy.center()

                    console.log('[GraphViewer] Graph centered and zoomed 🚀')
                })

                cyRef.current = cy
            })
        }, 0)

        return () => {
            clearTimeout(timeout)
            if (cyRef.current) {
                cyRef.current.destroy()
                cyRef.current = null
                console.log('[GraphViewer] Cytoscape destroyed')
            }
        }
    }, [nodes, edges])

    return (
        <div
            ref={containerRef}
            className="w-full h-[600px] bg-white border rounded shadow-inner"
            style={{ border: '2px dashed #ccc' }} // optional debug border
        />
    )
}
