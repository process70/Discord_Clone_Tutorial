"use client"

import { cn } from "@/lib/utils"
import { Channel, channelType, Member, Profile, Role, Server } from "@prisma/client"
import { Delete, Edit, Hash, Lock, Mic, ShieldAlert, ShieldCheck, Trash, Video } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import ActionTooltip from "./ActionTooltip"
import UserAvatar from "./UserAvatar"
import { ModalType, useModalStore } from "@/hooks/useModalStore"


interface Props {
    member: Member & {profile: Profile},
    server: Server,
}

const ServerMember = ({member, server}: Props) => {
    const router = useRouter()
    const params = useParams()

    const {onOpen} = useModalStore()

    const iconRole = {
        [Role.ADMIN]: <ShieldAlert className='w-5 h-5 text-rose-500'/>,
        [Role.MODERATOR]: <ShieldCheck className='w-5 h-5 text-indigo-500'/>,
        [Role.GUEST]: null
    }

    const Icon = iconRole[member.role]

    const onClick = () =>{
        router.push(`/servers/${params.serverId}/conversations/${member.id}`)
    }  
    
  return (
    <button className={cn(
        "group px-2 rounded-md flex items-center justify-between gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 py-2",
        params.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700")}
        onClick={onClick}>
        <div className="flex items-center gap-x-2">    
            <UserAvatar src={member.profile.imageUrl} className="h-8 w-8"/>
            <p className={cn(
                "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600",
                "dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params.memberId === member.id && "text-primary dark:text-zinc-200", 
                "dark:group-hover:text-white")}>
                {member.profile.name}
            </p>
        </div>
        {Icon}        
    </button>
  )
}

export default ServerMember