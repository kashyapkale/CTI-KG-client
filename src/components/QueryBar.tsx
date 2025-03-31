'use client'
import React, { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

type Props = {
    onSearch: (query: string) => void
}

export default function QueryBar({ onSearch }: Props) {
    const [query, setQuery] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            onSearch(query.trim())
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full flex justify-center mt-6">
            <div className="flex items-center border rounded overflow-hidden shadow-sm w-[400px] bg-white">
                <input
                    type="text"
                    placeholder="Your CTI Query..."
                    className="flex-grow px-4 py-2 text-sm focus:outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="px-4 bg-gray-700 hover:bg-gray-800 text-white">
                    <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>
        </form>
    )
}
