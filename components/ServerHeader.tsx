"use client"
import { ServerWithChannelsWithMembers } from '@/type'
import { channelType, Role, Server } from '@prisma/client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, 
    DropdownMenuTrigger } from './ui/dropdown-menu'
import { ChevronDown, Delete, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react'
import { useModalStore } from '@/hooks/useModalStore'

interface Props {
    server: ServerWithChannelsWithMembers,
    role?: Role
}

const ServerHeader = ({server, role}: Props) => {
    const isAdmin = role === Role.ADMIN
    const isModerator = role === Role.MODERATOR || isAdmin

    const { onOpen } = useModalStore()
  return (
    <DropdownMenu>
        <DropdownMenuTrigger className='focus:outline-none' asChild>
            <button className='w-full text-md font-semibold flex items-center h-12 border-neutral-200
                dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 
                dark:hover:bg-zinc-700/50 transition px-3'>
                {server.name}
                <ChevronDown className='ml-auto h-5 w-5' />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs font-meduim text-black 
            dark:text-neutral-400 space-y-[2px]">
            {isModerator && (
                <DropdownMenuItem className='text-indigo-600 dark:text-indigo-400 
                    px-3 py-2 text-sm cursor-pointer' 
                    onClick={() => onOpen("invite", { server })}>
                    Invite People
                    <UserPlus className='h-4 w-4 ml-auto'/>
                </DropdownMenuItem>
            )}
            {isAdmin && (
                <>
                    <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'
                        onClick={() => onOpen("editServer", { server })}>
                        Server Settings 
                        <Settings className='h-4 w-4 ml-auto'/>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer' 
                        onClick={() => onOpen("member", { server })}>
                        Manage Users
                        <Users className='h-4 w-4 ml-auto'/>
                    </DropdownMenuItem>
                </>
            )}
            {isModerator && (
                <>
                    <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'
                        onClick={() => onOpen("createChannel", { server })}>
                        create channel
                        <PlusCircle className='h-4 w-4 ml-auto'/>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                </>
            )}
            {isAdmin && (
                <DropdownMenuItem className='text-rose-500 px-3 py-2 text-sm cursor-pointer'
                    onClick={() => onOpen("deleteServer", { server })}>
                    Delete Server
                    <Trash className='h-4 w-4 ml-auto'/>
                </DropdownMenuItem>
            )}            
            {!isAdmin && (
                <DropdownMenuItem className='text-rose-500 px-3 py-2 text-sm cursor-pointer'
                    onClick={() => onOpen("leaveServer", { server })}>
                    Leave Server
                    <LogOut className='h-4 w-4 ml-auto'/>
                </DropdownMenuItem>
            )}            
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerHeader