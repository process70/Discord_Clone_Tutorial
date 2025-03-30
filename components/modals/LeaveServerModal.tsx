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
import { useRouter } from 'next/navigation'

const LeaveServerModal = () => {
    const { isOpen, onClose, type, data, onOpen } = useModalStore()
    const isModalOpen = isOpen && type === "leaveServer"

    const {server} = data

    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)

    const onClick = async() => {
        try {
            setIsLoading(true)
            await axios.patch(`/api/servers/${server?.id}/leave`)
            
            onClose()
            router.refresh()
            router.push('/')
        } catch (error: Error) {
            console.log(error.response.data)
        }
        finally{
            setIsLoading(false)
        }
    }

    
  return (
   <Dialog open={isModalOpen} onOpenChange={onClose}>
    <DialogContent className="bg-white text-black p-0">
      <DialogHeader className='pt-8 px-6'>
        <DialogTitle className='text-2xl text-center font-bold'>Leave Server</DialogTitle>
        <DialogDescription className='text-zinc-500 text-center'>
            Are you sure you want to leave this server 
            <span className='text-indigo-500 font-semibold pl-2 hover:underline'>
                {server?.name}
            </span>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className='px-6 py-4 bg-gray-100'>
        <div className="flex w-full justify-between items-center">
            <Button
                disabled={isLoading}
                onClick={onClose}
                variant='secondary'>
                Cancel
            </Button>
            <Button
                disabled={isLoading}
                onClick={onClick}
                variant='primary'>
                Confirm
            </Button>
        </div>
      </DialogFooter>
      <div className='p-6'>
   
      </div>
    </DialogContent>
  </Dialog>
  )
}

export default LeaveServerModal