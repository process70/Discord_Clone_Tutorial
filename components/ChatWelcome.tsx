import { Hash } from 'lucide-react'
import React from 'react'

type Props = {
    type: 'channel' | 'conversation',
    name: string
}

const ChatWelcome = ({type, name}: Props) => {
  return (
    <div className='space-y-2 px-4 mb-4'>
        {type === 'channel' && (
            <div className="flex h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700
            items-center justify-center">
                <Hash className='h-12 w-12 text-white'/>
            </div>
        )}
        <p className='text-xl md:text-3xl font-bold'>
            {type === 'channel' ? "welcome to #" : ""}{name}
        </p>
        <p className='text-winc-600 text-sm md:text-3xl font-bold'>
            {type === 'channel' ? 
                `this is the start of this #${name} channel.`: 
                `this is the start of your conversation with ${name}`}
        </p>
    </div>
  )
}

export default ChatWelcome