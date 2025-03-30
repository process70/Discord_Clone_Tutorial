import currentProfilePage from "@/lib/currentProfilePage";
import prisma from "@/prisma/client";
import { NextApiResponseIoSocket } from "@/type";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export default async function handler(req: NextApiRequest, res: NextApiResponseIoSocket){
    if(req.method !== 'POST') 
        return res.status(405).json('method not allowed')

    try {
        const { conversationId } = req.query

        const { content, fileUrl } = await req.body

        const profile = await currentProfilePage(req)
        if(!profile)
            return res.status(404).json('Unauthorized')

        if(!conversationId)
            return res.status(404).json('conversation id missing')

        //console.log({ conversationId } )

        if(!content)
            return res.status(400).json('content is required')

        const conversation = await prisma.converation.findFirst({
            where: {
                id: conversationId as string,
                /* OR: [{
                    memberOne: {
                        profileId: profile.id
                    },
                    memberTwo: {
                        profileId: profile.id
                    }
                }] */
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                },
            }
        })


        console.log({conversation})

        if(!conversation)
            return res.status(400).json('conversation not found');

        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : 
            conversation.memberTwo

        if(!member)
            return res.status(400).json('member not found')

        const message = await prisma.conversationMessage.create({
            data: {
                content,
                fileUrl,
                memberId: member.id,
                conversationId: conversationId as string           
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        // emit a socket io to all active conversation
        const channelKey = `chat:${conversationId}:messages`
        res?.socket?.server?.io?.emit(channelKey, message)

        return res.status(200).json(message)
    } catch (error) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json("Internal Error");
    }
}