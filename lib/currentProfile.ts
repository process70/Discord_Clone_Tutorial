import prisma from '@/prisma/client'
import { auth } from '@clerk/nextjs'
import React from 'react'

const currentProfile = async() => {
    const { userId } = auth()
    if(!userId) return null

    const user = await prisma.profile.findUnique({
        where: {
            userId
        }
    })
    return user
}

export default currentProfile