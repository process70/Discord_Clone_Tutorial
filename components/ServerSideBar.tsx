import currentProfile from '@/lib/currentProfile'
import prisma from '@/prisma/client'
import { redirectToSignIn } from '@clerk/nextjs'
import { channelType, Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import ServerHeader from './ServerHeader'
import { ScrollArea } from './ui/scroll-area'
import ServerSearch from './ServerSearch'
import { CircleUserRound, Hash, Mic, Play, ShieldAlert, ShieldCheck, ShieldQuestion, Video } 
from 'lucide-react'
import { Separator } from './ui/separator'
import ServerSection from './ServerSection'
import ServerChannel from './ServerChannel'
import ServerMember from './ServerMember'

interface serverSideBarProps {
    serverId: string
}
const ServerSideBar = async({serverId}: serverSideBarProps) => {
    const profile = await currentProfile()
    if(!profile) return redirect('/')

    const iconMap = {
        [channelType.TEXT]: <Hash className='w-4 h-4 mr-2'/>,
        [channelType.AUDIO]: <Mic className='w-4 h-4 mr-2'/>,
        [channelType.VIDEO]: <Video className='w-4 h-4 mr-2'/>
    }

    const RoleIconMap = {
        [Role.ADMIN]: <ShieldAlert className='w-4 h-4 mr-2 text-rose-500'/>,
        [Role.MODERATOR]: <ShieldCheck className='w-4 h-4 mr-2 text-indigo-500'/>,
        [Role.GUEST]: null
    }

    const server = await prisma.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }

    })
    
    if(!server) redirect('/')

    const textChannels = server?.channels.filter(channel => channel.type === channelType.TEXT)
    const audioChannels = server?.channels.filter(channel => channel.type === channelType.AUDIO)
    const videoChannels = server?.channels.filter(channel => channel.type === channelType.VIDEO)

    // exclude current user from members list
    const members = server?.members.filter(member => member.profileId !== profile.id)
    const role = server?.members.find(member => member.profileId === profile.id)?.role

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
        <ServerHeader server={server} role={role}/>
        <ScrollArea className="flex-1 px-3">
            <div className="mt-2">
                <ServerSearch 
                    pop = {[
                        {
                            label: "Text Channels",
                            type: "channel",
                            data: textChannels?.map(channel => ({
                                id: channel.id,
                                icon: iconMap[channel.type],
                                name: channel.name
                            }))
                        },
                        {
                            label: "Audio Channels",
                            type: "channel",
                            data: audioChannels?.map(channel => ({
                                id: channel.id,
                                icon: iconMap[channel.type],
                                name: channel.name
                            }))
                        },
                        {
                            label: "Video Channels",
                            type: "channel",
                            data: videoChannels?.map(channel => ({
                                id: channel.id,
                                icon: iconMap[channel.type],
                                name: channel.name
                            }))
                        },
                        {
                            label: "Members",
                            type: "member",
                            data: members?.map(member => ({
                                id: member.id,
                                icon: RoleIconMap[member.role],
                                name: member.profile.name
                            }))
                        }
                    ]}
                />
            </div>
            <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
            <div className="mb-2">
                <ServerSection channelType={channelType.TEXT} role={role}
                    label="Text Channels" sectionType='channel' server={server} />
                <div className="space-y-[2px]">
                    {textChannels?.map(channel => (
                        <ServerChannel 
                            key={channel.id} 
                            channel={channel} 
                            server={server} 
                            role={role} 
                        />
                    ))}
                </div>
            </div>

            <div className="mb-2">
                <ServerSection channelType={channelType.AUDIO} role={role}
                    label="Voice Channels" sectionType='channel' server={server} />
                <div className="space-y-[2px]">
                    {audioChannels?.map(channel => (
                        <ServerChannel 
                            key={channel.id} 
                            channel={channel} 
                            server={server} 
                            role={role} 
                        />
                    ))}
                </div>
            </div>

            <div className="mb-2">
                <ServerSection channelType={channelType.VIDEO} role={role}
                    label="Video Channels" sectionType='channel' server={server} />
                <div className="space-y-[2px]">
                    {videoChannels?.map(channel => (
                        <ServerChannel 
                            key={channel.id} 
                            channel={channel} 
                            server={server} 
                            role={role} 
                        />
                    ))}
                </div>
            </div>

            <div className="mb-2">
                <ServerSection role={role} label="Members" sectionType='member' server={server} />
                <div className="space-y-[2px]">
                    {members?.map(member => (
                        <ServerMember
                            key={member.id} 
                            member={member}
                            server={server} 
                        />
                    ))}
                </div>
            </div>
        </ScrollArea>
    </div>
  )
}

export default ServerSideBar