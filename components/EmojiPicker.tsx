"use client"
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Smile } from 'lucide-react'
import Picker  from '@emoji-mart/react'
import data  from '@emoji-mart/data'
import { useTheme } from 'next-themes'

interface Props {
    onChange: (value: string) => void,
}

const EmojiPicker = ({onChange}: Props) => {
    const {resolvedTheme} = useTheme()
  return (
    <Popover>
        <PopoverTrigger>
            <Smile className='text-zinc-500 dark:text-zinc-400 hover:text-zinc-00 
                dark:hover:text-zinc-300 transition'/>
        </PopoverTrigger>
        <PopoverContent side='right' sideOffset={40} 
            className='bg-transparent border-none shadow-none drop-shadow-none mb-16'>
            <Picker theme={resolvedTheme} data={data}  
                onEmojiSelect = {(emoji: any)=> onChange(emoji.native)} />
        </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker