"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } 
from '../ui/dialog'
import { useForm } from 'react-hook-form'

import * as z from 'zod'
import {zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } 
from '../ui/form'
import FileUpload from '../FileUpload'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useModalStore } from '@/hooks/useModalStore'
import queryString from 'query-string'

const MessageFileModal = () => {

    const {isOpen, onOpen, type, data, onClose} = useModalStore()
    const isModalOpen = isOpen && type == "messageFile"

    const { apiUrl, query } = data
    const router = useRouter()

    const formSchema = z.object({
        fileUrl: z.string().min(1, "attachement is required")
    })

    const form = useForm({
        defaultValues: {
            fileUrl: ''
        }, 
        resolver: zodResolver(formSchema)
    })

    const isLoading = form.formState.isSubmitting

    const handleClose = () => {
        form.reset()
        onClose()
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = queryString.stringifyUrl({
                url: apiUrl || "",
                query
            })
            await axios.post(url, {
                ...values, 
                content: values.fileUrl
            })

            form.reset()
            router.refresh()
            handleClose()

        } catch (error: any) {
            console.log(error.response.data)
        }
    }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
    <DialogContent className="bg-white text-black p-0 overflow-hidden">
      <DialogHeader className='pt-8 px-6'>
        <DialogTitle className='text-2xl text-center font-bold'>Add an attachement</DialogTitle>        
        <DialogDescription className='text-center text-sm text-zinc-500'>
            send a file as a message 
        </DialogDescription>
      </DialogHeader>
      <Form { ...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
                <div className="flex items-center justify-center text-center">
                    <FormField control={form.control} name="fileUrl" render={({field}) => (
                        <FormItem>                            
                            <FormControl>
                                <FileUpload value={field.value} onChange={field.onChange} 
                                    endpoints='messageFile' />
                            </FormControl>
                            <FormMessage />
                            <FormDescription />
                        </FormItem>
                        )}
                    />
                </div>
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
                <Button disabled={isLoading} variant='primary'>Send</Button>
            </DialogFooter>
        </form>  
      </Form>

    </DialogContent>
  </Dialog>
  )
}

export default MessageFileModal