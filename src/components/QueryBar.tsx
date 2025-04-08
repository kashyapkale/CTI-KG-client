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
        <form onSubmit={handleSubmit} className="w-full flex justify-center mt-8">
            <div className="flex items-center border rounded-full overflow-hidden shadow-lg w-[420px] bg-white">
                <input
                    type="text"
                    placeholder="Your CTI Query..."
                    className="flex-grow px-5 py-3 text-base focus:outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="
                            px-6        /* increased horizontal padding */
                            py-3        /* added vertical padding */
                            bg-gray-700
                            hover:bg-gray-800
                            text-white
                            transition
                            flex
                            items-center
                            justify-center
                          "
                >
                    <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true"/>
                </button>
            </div>
        </form>
    )
}
