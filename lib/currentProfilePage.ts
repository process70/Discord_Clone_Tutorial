import prisma from '@/prisma/client'
import { getAuth } from '@clerk/nextjs/server'
import { NextApiRequest } from 'next'

const currentProfilePage = async(req: NextApiRequest) => {
    const { userId } = getAuth(req)
    if(!userId) return null

    const user = await prisma.profile.findUnique({
        where: {
            userId
        }
    })
    return user
}

export default currentProfilePage