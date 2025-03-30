"use client"
import React from 'react'
import { useSocket } from './SocketProvider'
import { Badge } from './ui/badge'

type Props = {}

const SocketIndicator = (props: Props) => {
    const { isConnected } = useSocket()

    if(!isConnected)  return (
        <Badge variant="outline" className='bg-yellow-600 text-white border-none'>
            FallBack pooling every 1s
        </Badge>
    )
  return (
    <Badge variant="outline" className='bg-emerald-600 text-white border-none'>
        live: real-time update
    </Badge>
  )
}

export default SocketIndicator