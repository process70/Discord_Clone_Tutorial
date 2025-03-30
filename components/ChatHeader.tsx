import { Hash, Menu } from 'lucide-react'
import React from 'react'
import MobileToggle from './MobileToggle'
import UserAvatar from './UserAvatar'
import SocketIndicator from './SocketIndicator'
import ChatVideoBottton from './ChatVideoBottton'

interface Props {
    serverId: string,
    name: string,
    type: "channel" | "conversation",
    imageUrl?: string    
}

const ChatHeader = ({serverId, name, type, imageUrl}: Props) => {
  return (
    <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 
        dark:border-neutral-800 border-b-2'>
         <MobileToggle serverId={serverId}/>
         {type === "channel" && (
            <Hash className='h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2'/>
         )}
         {type === "conversation" && (
            <UserAvatar src={imageUrl}/>
         )}
         <p className='ml-2 font-semibold text-md text-black dark:text-white'>
            {name}
        </p>
        <div className="ml-auto flex items-center">
          {type === "conversation" && (
            <ChatVideoBottton />
          )}
          <SocketIndicator/>
        </div>
    </div>
  )
}

export default ChatHeader