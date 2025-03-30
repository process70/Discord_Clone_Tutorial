"use client"

import { Search } from "lucide-react"
import React, { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } 
from "./ui/command"
import { useParams, useRouter } from "next/navigation"
import { DialogTitle } from "./ui/dialog"

/* React.ReactNode is a TypeScript type that represents anything that can be rendered 
in a React application. It's a union type that includes all possible return types from a React component. */

interface Props {
    pop: {
        label: string,
        // Determines what kind of items we're searching
        type: 'channel' | 'member'
        // Array of objects for searchable items
        data: {
            id: string,
            icon: React.ReactNode, //search icon
            name: string,
        } [] | undefined
    }[]
}

const ServerSearch = ({pop}: Props) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const params = useParams()

    // activate ctrl+k to open the search dialog
    useEffect(() => {

        const down = (e: KeyboardEvent) => {
            if(e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }            
        }
        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    const click = ({id, type}: {id: string, type: "channel" | "member"}) => {
        setOpen(false)
        if(type === 'channel') 
            return router.push(`/servers/${params?.serverId}/conversations/${id}`)
        
        if(type === 'member') 
            return router.push(`/servers/${params?.serverId}/channels/${id}`)
    }
  return (
    <>
    <button className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full 
        hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
        onClick={() => setOpen(true)}>
            <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400"/>
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 
            group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
            Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 
            rounded border bg-muted px-1.5 font-medium font-mono text-[10px] 
            text-muted-foreground ml-auto">
            <span className="text-xs">⌘</span>K
        </kbd>
    </button>
    <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle />
        {/* Search input field
        Handles user typing/filtering */}
        <CommandInput placeholder="search all channels and members" />
        <CommandList>
            <CommandEmpty>
                no results found
            </CommandEmpty>
            {pop?.map(({ label, type, data }) => (
                <CommandGroup heading={label} key={label}>
                    {data?.map(({ id, icon, name }) => (
                        <CommandItem key={id} onSelect={() => click({id, type})}>
                            {icon} <span>{name}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            ))}
        </CommandList>
    </CommandDialog>
    </>
  )
}

export default ServerSearch