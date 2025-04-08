'use client'
import React from 'react'
import QueryBar from '@/components/QueryBar' // Adjust the import path as needed

// Accept the search handler as a prop
type HeaderProps = {
    onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-white shadow-md">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-4">
                {/* Placeholder Logo */}
                <div className="text-2xl font-bold text-blue-600">🔗</div>
                <h1 className="text-xl font-semibold text-gray-800">
                    Cyber Threat Intelligence – Knowledge Graph
                </h1>
            </div>

            {/* Center: Search Bar */}
            <div className="flex justify-center flex-1 mx-4">
                <QueryBar onSearch={onSearch} />
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
