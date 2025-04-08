'use client'
import React from 'react'
import UploadPanel from './UploadPanel'
import type { TripletFile } from '@/types' // ✅ make sure this is correct path

type Props = {
    onUpload: (files: TripletFile[]) => void
    onHomeClick: () => void // ← Add this prop
}

export default function Sidebar({ onUpload, onHomeClick }: Props) {
    return (
        <aside className="w-72 min-h-screen bg-gradient-to-b from-white to-gray-50 border-r p-6 flex flex-col justify-between shadow-md">
            <div>
                {/* Workspace Selector */}
                <div className="mb-8">
                    <div className="text-sm text-gray-500">Workspace</div>
                    <div className="font-medium flex items-center justify-between mt-1 text-gray-800">
                        Kashyap’s Space <span className="text-xs text-gray-400">▼</span>
                    </div>
                    <div className="text-xs text-gray-400">3D-Visualisation</div>
                </div>

                {/* Navigation */}
                <nav className="mb-8">
                    <ul className="space-y-3 text-sm text-gray-700">
                        <li
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition"
                            onClick={onHomeClick} // ← Call the prop
                        >
                            🏠 Home
                        </li>
                        <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
                            ⚙️ Settings
                        </li>
                    </ul>
                </nav>

                {/* Upload Panel */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-800">Upload files</h3>
                    <UploadPanel onDataLoaded={onUpload} />
                </div>
            </div>

            {/* Invite Button */}
            <div className="mt-8">
                <button className="text-sm w-full border border-gray-300 rounded px-3 py-2 hover:bg-gray-50 transition">
                    + Invite
                </button>
            </div>
        </aside>
    )
}
