import currentProfilePage from "@/lib/currentProfilePage";
import prisma from "@/prisma/client";
import { NextApiResponseIoSocket } from "@/type";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export default async function handler(req: NextApiRequest, res: NextApiResponseIoSocket){
    if(req.method !== 'POST') 
        return res.status(405).json('method not allowed')

    try {
        const {serverId, channelId} = req.query

        const { content, fileUrl } = await req.body

        const profile = await currentProfilePage(req)
        if(!profile)
            return res.status(404).json('Unauthorized')

        if(!serverId)
            return res.status(404).json('server id missing')
        if(!channelId)
            return res.status(404).json('channel id missing')

        if(!content)
            return res.status(400).json('content is required')

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

        const message = await prisma.message.create({
            data: {
                content,
                fileUrl,
                memberId: member.id,
                channelId: channel.id as string
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

        // emit a socket io to all active conversation
        const channelKey = `chat:${channelId}:messages`
        res?.socket?.server?.io?.emit(channelKey, message)

        return res.status(200).json(message)
    } catch (error) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json("Internal Error");
    }
}