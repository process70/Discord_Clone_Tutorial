import currentProfilePage from "@/lib/currentProfilePage";
import prisma from "@/prisma/client";
import { NextApiResponseIoSocket } from "@/type";
import { Role } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseIoSocket){
    if(req.method !== 'DELETE' && req.method !== 'PATCH') 
        return res.status(405).json('method not allowed')

    try {
        const { messageId, conversationId } = req.query

        const { content } = await req.body

        const profile = await currentProfilePage(req)
        if(!profile)
            return res.status(404).json('Unauthorized')
        if(!messageId)
            return res.status(404).json('conversation message id missing')
        if(!conversationId)
            return res.status(404).json('conversation id missing')

        const conversation = await prisma.converation.findUnique({
            where: {
                id: conversationId as string
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
                }                   
                
            }            
        })

        if(!conversation)
            return res.status(400).json("conversation not found")

        const member = conversation.memberOne.profileId === profile.id ? 
            conversation.memberOne : conversation.memberTwo 

        if(!member)
            return res.status(400).json('member not found')

        let conversationMessage = await prisma.conversationMessage.findFirst({
            where: {
                id: messageId as string,
                conversationId: conversationId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                },
                conversation: true
            }
        })

        if(!conversationMessage || conversationMessage.delete)
            return res.status(400).json('conversation message not found or deleted')

        const messageOwner = conversationMessage.memberId === member.id
        const isAdmin = member.role = Role.ADMIN
        const isModerator = member.role = Role.MODERATOR

        if(!messageOwner) 
            return res.status(400).json('Unauthorized, you cannot edit this message')
        
        if(req.method === "DELETE" && (messageOwner || isAdmin || isModerator)){
            // soft delete
            conversationMessage = await prisma.conversationMessage.update({
                where: {
                    id: messageId as string
                },
                data: {
                    content: "this conversation Message is deleted",
                    delete: true,
                    fileUrl: ""
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    },
                    conversation: true
                }
            })
        }

        if(req.method === "PATCH" && messageOwner){
            // soft delete
            conversationMessage = await prisma.conversationMessage.update({
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
                    conversation: true
                }
            })
        }
        // emit a socket io to all active conversation
        const updatelKey = `chat:${conversationId}:messages:update`
        res?.socket?.server?.io?.emit(updatelKey, conversationMessage)

        return res.status(200).json(conversationMessage)
    } catch (error) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json("Internal Error");
    }
}