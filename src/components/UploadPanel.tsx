'use client'
import React, { useState } from 'react'
import { TripletFile } from '@/types'

type Props = {
    onDataLoaded: (parsed: TripletFile[]) => void
}

export default function UploadPanel({ onDataLoaded }: Props) {
    const [error, setError] = useState<string | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

    const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        setSelectedFiles(files)
        if (!files) return

        const parsedFiles: TripletFile[] = []

        for (const file of Array.from(files)) {
            try {
                const text = await file.text()
                const json = JSON.parse(text)

                if (json.IE?.triplets?.length) {
                    parsedFiles.push(json as TripletFile)
                } else {
                    throw new Error(`Missing IE.triplets in ${file.name}`)
                }
            } catch (err) {
                setError(`Failed to parse ${file.name}: ${(err as Error).message}`)
                return
            }
        }

        setError(null)
        onDataLoaded(parsedFiles)
    }

    const handleUpload = () => {
        if (!selectedFiles) return
        // Trigger file processing again on upload
        handleFiles({ target: { files: selectedFiles } } as React.ChangeEvent<HTMLInputElement>)
    }

    return (
        <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            {/* Drop Zone */}
            <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-300 rounded bg-white text-center mb-4">
                <div className="text-3xl mb-2">☁️</div>
                <p className="text-sm font-medium">Drop files here</p>
                <p className="text-xs text-gray-500 mb-2">Supported format: JSON</p>
                <label className="text-sm text-blue-600 cursor-pointer hover:underline">
                    Browse files
                    <input
                        type="file"
                        multiple
                        accept=".json"
                        onChange={handleFiles}
                        className="hidden"
                    />
                </label>
            </div>

            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

            {/* Actions */}
            <div className="flex justify-between gap-2 text-sm">
                <button
                    className="flex-1 border border-gray-300 rounded px-3 py-2 hover:bg-gray-100 transition"
                    onClick={() => {
                        setSelectedFiles(null)
                        setError(null)
                    }}
                >
                    Cancel
                </button>
                <button
                    className="flex-1 bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700 transition disabled:opacity-50"
                    onClick={handleUpload}
                    disabled={!selectedFiles}
                >
                    Upload
                </button>
            </div>
        </div>
    )
}
