"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { io as ClientIO } from "socket.io-client"

interface Props {
    socket: any | null,
    isConnected: boolean
}

const socketContext = createContext<Props>({
    socket: null,
    isConnected: false
})

export const useSocket = () => {
    return useContext(socketContext)
}

const SocketProvider = ({children}: {children: React.ReactNode}) => {
    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        // Initialize the Socket.IO server first
        const initSocket = async () => {
            try {
                const res = await fetch('/api/socket/io');
                console.log(await res.json())
                
                const socketIO = new (ClientIO as any)(window.location.origin, {
                    path: "/api/socket/io",
                    addTrailingSlash: false,
                    /* reconnection: true, */
                    transports: ['polling', 'websocket']
                });
                
                socketIO.on('connect', () => {
                    // console.log('Socket connected:', socketIO.id);
                    setIsConnected(true);
                });
                
                socketIO.on('connect_error', (err: any) => {
                    // console.error('Socket connection error:', err);
                    setIsConnected(false);
                });
                
                socketIO.on('disconnect', () => {
                    // console.log('Socket disconnected');
                    setIsConnected(false);
                });
                
                setSocket(socketIO);
                
                return socketIO;
            } catch (error) {
                console.error('Failed to initialize socket:', error);
                return null;
            }
        };
        
        const socketInstance = initSocket();
        
        return () => {
            if (socketInstance) {
                (socketInstance as any).then((socket: any) => {
                    if (socket) socket.disconnect();
                });
            }
        };
    }, []);

    return <socketContext.Provider value={{socket, isConnected}}>{children}</socketContext.Provider>
}

export default SocketProvider