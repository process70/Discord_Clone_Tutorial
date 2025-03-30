"use client"

import { cn } from "@/lib/utils"
import ActionTooltip from "./ActionTooltip"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { serverHooks } from "next/dist/server/app-render/entry-base"

interface NavigationItemProps {
    id: string,
    imageUrl: string,
    name: string
}
const NavigationItem = ({id, imageUrl, name}: NavigationItemProps) => {
    const params = useParams()
    const router = useRouter() 

    const onClick = () => {
        router.push(`/servers/${id}`)
    }

  return (
    <ActionTooltip side="right" align="center" label={name}>
        <button onClick={onClick} 
            className="group flex items-center relative w-full">
                {/* absolute left-0 bg-primary rounded-r-full transition-all w-[4px] group-hover:h-[20px] 
                    that means when we hover on that element all the transition animation will apply*/}
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[36px]",
                    params?.serverId === id ? "h-[36px]" : "h-[8px]"
                )} />
                <div className={cn(
                    "relative flex mx-3 group h-[48px] w-[48px] group-hover:rounded-[16px]", 
                    "rounded-[24px] transition-all overflow-hidden",
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    <Image fill src={imageUrl} alt="Channel"/>
                </div>
            </button>
    </ActionTooltip>
  )
}

export default NavigationItem