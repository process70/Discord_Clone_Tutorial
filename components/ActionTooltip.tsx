"use client"

import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface ActionTooltipProps {
    children: React.ReactNode,
    label: string,
    side?: "right" | "left" | "top" | "bottom",
    align?: "start" | "center" | "end"

}
const ActionTooltip = ({children, label, side, align}: ActionTooltipProps) => {
  return (
    <div>
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold text-sm capitalize">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
  )
}

export default ActionTooltip