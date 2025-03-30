"use client"

import { Plus } from "lucide-react"
import ActionTooltip from "./ActionTooltip"
import { useModalStore } from "@/hooks/useModalStore"

const NavigationAction = () => {
  const {onOpen} = useModalStore()
  return (
    <div>
        <ActionTooltip side="right" align="center" label="Add a Server">
            {/* The group class in Tailwind CSS enables parent-child hover interactions. It's particularly 
            useful when you want to style child elements based on the parent's hover state. */}
            <button className="group flex items-center" onClick={() => onOpen("createServer")}>
                <div className="flex mx-3 h-[48px] w-[48px] overflow-hidden rounded-[24px] 
                    group-hover:rounded-[16px] transition-all items-center justify-center bg-background 
                    dark:bg-neutral-700 group-hover:bg-emerald-500">
                        <Plus className="group-hover:text-white transition text-emerald-500" size={25}/>
                </div>
            </button>
        </ActionTooltip>
    </div>
  )
}

export default NavigationAction