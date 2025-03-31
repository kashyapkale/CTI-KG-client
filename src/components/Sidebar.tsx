'use client'
import React from 'react'
import UploadPanel from './UploadPanel'

type Props = {
    onUpload: (files: any[]) => void
}

export default function Sidebar({ onUpload }: Props) {
    return (
        <aside className="w-72 min-h-screen bg-white border-r p-4 flex flex-col justify-between">
            <div>
                {/* Workspace Selector */}
                <div className="mb-6">
                    <div className="text-sm text-gray-500">Workspace</div>
                    <div className="font-medium flex items-center justify-between mt-1">
                        Emily’s Space <span className="text-xs text-gray-400">▼</span>
                    </div>
                    <div className="text-xs text-gray-400">10 projects</div>
                </div>

                {/* Navigation */}
                <nav className="mb-6">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                            🏠 Home
                        </li>
                        <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                            ⚙️ Settings
                        </li>
                    </ul>
                </nav>

                {/* Upload Panel (reuses your working component) */}
                <div>
                    <h3 className="text-sm font-semibold mb-2">Upload files</h3>
                    <UploadPanel onDataLoaded={onUpload} />
                </div>
            </div>

            {/* Invite Button (static placeholder) */}
            <div className="mt-6">
                <button className="text-sm w-full border border-gray-300 rounded px-3 py-2 hover:bg-gray-50 transition">
                    + Invite
                </button>
            </div>
        </aside>
    )
}
