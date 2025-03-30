'use client'

import { ServerWithChannelsWithMembers } from "@/type"
import { channelType, Role } from "@prisma/client"
import ActionTooltip from "./ActionTooltip"
import { Plus, Settings } from "lucide-react"
import { useModalStore } from "@/hooks/useModalStore"

interface Props {
    label: string, 
    role?: Role, 
    sectionType: "channel" | "member",
    channelType?: channelType,
    server?: ServerWithChannelsWithMembers
}

const ServerSection = ({ label, channelType, sectionType, role, server }: Props) => {
    const { onOpen } = useModalStore()

  return (
    <div className="flex items-center justify-between py-2">
        <p className="font-semibold text-sm uppercase text-zinc-500 dark:text-zinc-400">
            {label}
        </p>
        {role !== Role.GUEST && sectionType === "channel" && (
            <ActionTooltip label="create channel" side="top">
                <button className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400
                dark:hover:text-zinc-300" 
                    onClick={() => onOpen("createChannel", {channelType: channelType})}>
                    <Plus className="h-4 w-4"/>
                </button>
            </ActionTooltip>
        )}
        {role === Role.ADMIN && sectionType === "member" && (
            <ActionTooltip label="manage members" side="top">
                <button className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400
                dark:hover:text-zinc-300" 
                    onClick={() => onOpen("member", {server})}>
                    <Settings className="h-4 w-4"/>
                </button>
            </ActionTooltip>
        )}
    </div>
  )
}

export default ServerSection