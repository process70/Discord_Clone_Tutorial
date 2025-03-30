import { NextApiResponseIoSocket } from '@/type.d';
import { Server as NetServer } from "http";
import { NextApiRequest } from 'next';
import { Server as ServerIO } from "socket.io";

export const config = {
    api: {
        bodyParser: false
    }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseIoSocket) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;

        const io = new ServerIO(httpServer, {
            path,
            addTrailingSlash: false,
            transports: ['polling', 'websocket'],
            cors: {
                origin: "http://localhost:3000",
                methods: ['GET', 'POST', "DELETE", "PATCH"],
            },
        });

        // Define your socket event handlers here
        io.on('connection', (socket) => {
            // console.log('Socket connected:', socket.id);
            
            socket.on('disconnect', () => {
                // console.log('Socket disconnected:', socket.id);
            });
            
            // Add your custom event handlers here
        });

        res.socket.server.io = io;
    }

    res.end();
}

export default ioHandler;