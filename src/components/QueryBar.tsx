'use client'
import React from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export default function QueryBar() {
    return (
        <div className="w-full flex justify-center mt-6">
            <div className="flex items-center border rounded overflow-hidden shadow-sm w-[400px] bg-white">
                <input
                    type="text"
                    placeholder="Your CTI Query..."
                    className="flex-grow px-4 py-2 text-sm focus:outline-none"
                />
                <button className="px-4 bg-gray-700 hover:bg-gray-800 text-white">
                    <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}
