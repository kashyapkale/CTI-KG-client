'use client'
import React from 'react'

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-4">
                {/* Placeholder Logo */}
                <div className="text-xl font-bold text-blue-600">🔗</div>
                <h1 className="text-lg font-semibold text-gray-800">
                    Cyber Threat Intelligence – Knowledge Graph
                </h1>
            </div>

            {/* Right: Download Button */}
            <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border rounded hover:bg-gray-200 transition"
                disabled
            >
                Download
            </button>
        </header>
    )
}
