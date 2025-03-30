"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import ActionTooltip from "./ActionTooltip"
import { Video, VideoOff } from "lucide-react"
import queryString from "query-string"

type Props = {}

const ChatVideoBottton = (props: Props) => {
    const pathName = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const isVideo = searchParams?.get('video')
    const Icon = isVideo ? VideoOff : Video

    const tooltipLabel = isVideo ? "end video call" : "start video call"

    const onClick = () => {
        const url = queryString.stringifyUrl({
            url: pathName || "",
            query: {
                video: isVideo ? undefined : true
            }
        })
        router.push(url)
    }
  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
        <button onClick={onClick} className="hover:opacity-75 transition mr-4">
            <Icon className="h-6 w-6 text-zinc-500 hover:text-zinc-400"/>
        </button>
    </ActionTooltip>
  )
}

export default ChatVideoBottton