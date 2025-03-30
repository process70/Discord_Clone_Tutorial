import currentProfilePage from "@/lib/currentProfilePage";
import prisma from "@/prisma/client";
import { NextApiResponseIoSocket } from "@/type";
import { Role } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseIoSocket){
    if(req.method !== 'DELETE' && req.method !== 'PATCH') 
        return res.status(405).json('method not allowed')

    try {
        const {serverId, channelId, messageId} = req.query

        const { content } = await req.body

        const profile = await currentProfilePage(req)
        if(!profile)
            return res.status(404).json('Unauthorized')

        if(!serverId)
            return res.status(404).json('server id missing')
        if(!channelId)
            return res.status(404).json('channel id missing')
        if(!messageId)
            return res.status(404).json('message id missing')

        const server = await prisma.server.findUnique({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                },
            },
            include: {
                // include members without profile
                members: true
            }
        })

        if(!server)
            return res.status(400).json('server not found')

        const channel = await prisma.channel.findFirst({
            where: {
                id: channelId as string,
                // channel inside that server
                serverId: server.id as string
            }
        })

        if(!channel)
            return res.status(400).json('channel not found')

        const member = server.members.find(member => member.profileId === profile.id)

        if(!member)
            return res.status(400).json('member not found')

        let message = await prisma.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                },
                channel: true
            }
        })

        if(!message || message.delete)
            return res.status(400).json('message not found')

        const messageOwner = message.memberId === member.id
        const isAdmin = member.role = Role.ADMIN
        const isModerator = member.role = Role.MODERATOR

        if(!messageOwner) 
            return res.status(400).json('Unauthorized, you cannot edit this message')
        
        if(req.method === "DELETE" && (messageOwner || isAdmin || isModerator)){
            // soft delete
            message = await prisma.message.update({
                where: {
                    id: messageId as string
                },
                data: {
                    content: "this message is deleted",
                    delete: true,
                    fileUrl: ""
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    },
                    channel: true
                }
            })
        }

        if(req.method === "PATCH" && messageOwner){
            // soft delete
            message = await prisma.message.update({
                where: {
                    id: messageId as string
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    },
                    channel: true
                }
            })
        }
        // emit a socket io to all active conversation
        const updatelKey = `chat:${channelId}:messages:update`
        res?.socket?.server?.io?.emit(updatelKey, message)

        return res.status(200).json(message)
    } catch (error) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json("Internal Error");
    }
}