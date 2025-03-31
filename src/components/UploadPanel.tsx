'use client'
import React, { useState } from 'react'
import { TripletFile } from '@/types'

type Props = {
    onDataLoaded: (parsed: TripletFile[]) => void
}

export default function UploadPanel({ onDataLoaded }: Props) {
    const [error, setError] = useState<string | null>(null)

    const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
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

    return (
        <div className="p-4 border rounded-md bg-white shadow mb-6">
            <label className="block font-medium mb-2">📁 Upload Triplet JSON Files:</label>
            <input
                type="file"
                multiple
                accept=".json"
                onChange={handleFiles}
                className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
    )
}
