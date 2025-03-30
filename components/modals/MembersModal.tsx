"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'

import { useModalStore } from '@/hooks/useModalStore'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Check, Copy, Gavel, Loader2, MoreVertical, RefreshCcw, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { useOrigin } from '@/hooks/useOrigin'
import { useState } from 'react'
import axios from 'axios'
import { ServerWithChannelsWithMembers } from '@/type'
import { ScrollArea } from '../ui/scroll-area'
import UserAvatar from '../UserAvatar'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, 
    DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuSub,DropdownMenuSubContent, 
    DropdownMenuSubTrigger } from '../ui/dropdown-menu'
import { Role } from '@prisma/client'

import qs from 'query-string'
import { useRouter } from 'next/navigation'

const MembersModal = () => {
    const { isOpen, onClose, type, data, onOpen } = useModalStore()
    const isModalOpen = isOpen && type === "member"

    const [loadingId, setLoadingId] = useState("")

    /*The as keyword performs a type assertion (also known as type casting)
    The assertion tells TypeScript to treat data as an object with a specific shape
    In this case, it expects an object with a server property of type ServerWithChannelsWithMembers */
    const { server } = data as {server: ServerWithChannelsWithMembers}

    const router = useRouter()

    const RoleIcon = {
       "GUEST": null,
       "MODERATOR": <ShieldCheck className='w-4 h-4 ml-2 text-indigo-500'/>,
       "ADMIN": <ShieldAlert className='w-4 h-4 ml-2 text-rose-600 font-bold' /> 
    }

    const onRoleChange = async(memberId: string, role: Role) => {
        try {
            setLoadingId(memberId)
            // /api/member/memberId?serverId=server.id&memberId=memberId
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server.id,
                }
            })
            const response = await axios.patch(url, {role})
            console.log(response.data)
            router.refresh()
            onOpen("member", {server: response.data})
        } catch (error: Error) {
            console.log(error.response.data)
        }
        finally{
            setLoadingId("")
        }
    }

    const onKick = async(memberId: string) => {
        try {
            setLoadingId(memberId)
            // /api/member/memberId?serverId=server.id&memberId=memberId
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server.id,
                }
            })
            const response = await axios.delete(url)
            console.log(response.data)
            router.refresh()
            onOpen("member", {server: response.data})
        } catch (error: Error) {
            console.log(error.response.data)
        }
        finally{
            setLoadingId("")
        }
    }
    
  return (
   <Dialog open={isModalOpen} onOpenChange={onClose}>
    <DialogContent className="bg-white text-black overflow-hidden">
      <DialogHeader className='pt-8 px-6'>
        <DialogTitle className='text-2xl text-center font-bold'>Manage Memers</DialogTitle>        
        <DialogDescription className='text-center text-zinc-500'>
            {server?.members?.length } Members
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className='mt-8 max-h-[420px] pr-6'>
        {server?.members?.map((member) => (
            <div key={member.id} className="flex gap-x-2 items-center mb-3">
                <UserAvatar src={member.profile.imageUrl}/>
                <div className="flex flex-col gap-y-1">
                    <div className="font-semibold text-xs flex">
                        {member.profile.name}
                        {RoleIcon[member.role]}
                        {/* {member.role === "ADMIN" ? RoleIcon.ADMIN
                            :member.role === "MODERATOR" ? RoleIcon.MODERATOR 
                            : RoleIcon.GUEST} */}
                    </div>
                    <p className='text-xs text-zinc-500'>{member.profile.email}</p>
                </div>
                {/* server.profileId !== member.profileId: never edit the server's owner role */}
                {server.profileId !== member.profileId && member.id !== loadingId && (
                    <div className='ml-auto'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <MoreVertical className='h-4 w-4 text-zinc-500'/>
                            </DropdownMenuTrigger>                            
                            <DropdownMenuContent side="left">
                                <DropdownMenuSub>
                                <DropdownMenuSubTrigger className='flex items-center'>
                                    <ShieldQuestion className="mr-2 h-4 w-4" />
                                    <span>Role</span>
                                </DropdownMenuSubTrigger>                                
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                    <DropdownMenuItem 
                                        onClick={() => onRoleChange(member.id, "GUEST")}>
                                        <Shield className='mr-2 h-4 w-4'/> Guest
                                        {member.role === "GUEST" && 
                                            (<Check className='ml-auto h-4 w-4'/>)}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                        <ShieldCheck className='mr-2 h-4 w-4'/> Moderator
                                        {member.role === "MODERATOR" && 
                                            (<Check className='ml-auto h-4 w-4'/>)}
                                    </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onKick(member.id)}>
                                    <Gavel className="mr-2 h-4 w-4" />
                                    Kick
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
                {loadingId === member.id && (
                    <Loader2 className='animate-spin text-zinc-500 ml-auto h-4 w-4'/>
                )}
            </div>
        ))}
      </ScrollArea>
    </DialogContent>
  </Dialog>
  )
}

export default MembersModal