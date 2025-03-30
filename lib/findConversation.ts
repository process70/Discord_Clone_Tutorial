import prisma from "@/prisma/client"

export async function getOrCreateConversation(memberOneId: string, memberTwoId: string){
    let conversation = await findConversation(memberOneId, memberTwoId)

    if(!conversation)
        conversation = await createConversation(memberOneId, memberTwoId) 

    return conversation
}

export async function findConversation(memberOneId: string, memberTwoId: string) {
    try {
        return await prisma.converation.findFirst({
            where: {
                OR: [
                    {
                        memberOneId,
                        memberTwoId
                    },
                    {
                        memberOneId: memberTwoId,
                        memberTwoId: memberOneId
                    }
                ]
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
    } catch (error) {
        console.error('Error finding conversation:', error);
        return null
    }
}

export async function createConversation(memberOneId: string, memberTwoId: string) {
    try {
        return await prisma.converation.create({
            data: {
                memberOneId,
                memberTwoId
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
    } catch (error) {
        console.error('Error creating conversation:', error);
        return null
    }
}