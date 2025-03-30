"use client"

import { cn } from "@/lib/utils"
import { Channel, channelType, Role, Server } from "@prisma/client"
import { Delete, Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import ActionTooltip from "./ActionTooltip"
import { ModalType, useModalStore } from "@/hooks/useModalStore"


interface Props {
    channel: Channel,
    server: Server,
    role?: Role    
}

const ServerChannel = ({channel, server, role}: Props) => {
    const router = useRouter()
    const params = useParams()

    const { isOpen, onClose, type, data, onOpen } = useModalStore()

/*     useEffect(() => {
        console.log(`params channel id: ${params.channelId}`)
        console.log(`channel id: ${channel.id}`)
    }, []) */

    const iconMap = {
        [channelType.TEXT]: <Hash className='w-4 h-4 mr-2'/>,
        [channelType.AUDIO]: <Mic className='w-4 h-4 mr-2'/>,
        [channelType.VIDEO]: <Video className='w-4 h-4 mr-2'/>
    }

    const Icon = iconMap[channel.type]

    const onClick = () =>{
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
    }

    // prevent redirecting to another page when opening a modal
    const onAction = (e: React.MouseEvent, action: ModalType) =>{
        e.stopPropagation()
        onOpen(action, { server, channel })
    }
    return (
        <button 
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center w-full",
                "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === channel.id && "bg-zinc-700 dark:bg-zinc-700/20"
            )}
        >
            <div className="flex items-center gap-x-2 w-full">
                <div className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400">
                    {Icon}
                </div>
                <p className={cn(
                    "line-clamp-1 text-sm text-zinc-500 group-hover:text-zinc-600",
                    "dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                    params?.channelId === channel.id && 
                        "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}>
                    {channel.name}
                </p>
            </div>
    
            {channel.name !== "general" && role !== Role.GUEST && (
                <div className="ml-auto flex items-center gap-x-2 flex-shrink-0">
                    <ActionTooltip label="edit">
                        <Edit 
                            onClick={(e) => onAction(e, "editChannel")}
                            className="hidden group-hover:block h-4 w-4 text-zinc-500 
                                hover:text-zinc-600 dark:text-zinc-400 
                                dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                    <ActionTooltip label="delete">
                        <Trash 
                            onClick={(e) => onAction(e, "deleteChannel")}
                            className="hidden group-hover:block h-4 w-4 text-zinc-500 
                                hover:text-zinc-600 dark:text-zinc-400 
                                dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === "general" && (
                <Lock className="ml-auto flex-shrink-0 h-4 w-4 text-zinc-500 
                    hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"/>
            )}
        </button>
    )
}

export default ServerChannel