"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'

import { useModalStore } from '@/hooks/useModalStore'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Check, Copy, RefreshCcw } from 'lucide-react'
import { useOrigin } from '@/hooks/useOrigin'
import { useState } from 'react'
import axios from 'axios'

const InviteModal = () => {
    const { isOpen, onClose, type, data, onOpen } = useModalStore()
    const isModalOpen = isOpen && type === "invite"

    const origin = useOrigin()
    const inviteUrl = `${origin}/invite/${data.server?.inviteCode}`

    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
        
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    const generate = async() => {
        try {
            setIsLoading(true)
            const response = await axios.patch(`/api/servers/${data.server?.id}/inviteCode`)
            onOpen("invite", {server: response.data})
            setIsLoading(false)
        } catch (error: any) {
            console.log(error.response.data)
        }
    }

    
  return (
   <Dialog open={isModalOpen} onOpenChange={onClose}>
    <DialogContent className="bg-white text-black p-0 overflow-hidden">
      <DialogHeader className='pt-8 px-6'>
        <DialogTitle className='text-2xl text-center font-bold'>Invite Friends</DialogTitle>        
      </DialogHeader>
      <div className='p-6'>
        <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
            Server invite link
        </Label>
        <div className='flex items-center mt-2 gap-x-2'>
            <Input className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black 
                focus-visible:ring-offset-0' value={inviteUrl} disabled={isLoading}/>
            <Button size="icon" onClick={onCopy} disabled={isLoading}>
                {copied ? 
                    <Check className='w-4 h-4'/>: 
                    <Copy className='w-4 h-4'/>}
            </Button>    
        </div>
        <Button size="sm" className='text-sm text-zinc-500 mt-4' 
            disabled={isLoading} onClick={generate}>
            Generate a new link
            <RefreshCcw className='w-4 h-4 ml-2'/>
        </Button>    
      </div>
    </DialogContent>
  </Dialog>
  )
}

export default InviteModal