// app/providers/QueryProvider.tsx
"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { useSocket } from './SocketProvider'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const {isConnected} = useSocket()
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchInterval: isConnected ? false : 1000,                
            }
        }
    }))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}