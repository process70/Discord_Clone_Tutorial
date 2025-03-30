"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useForm } from 'react-hook-form'

import * as z from 'zod'
import {zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import FileUpload from '../FileUpload'

import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useModalStore } from '@/hooks/useModalStore'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } 
from '../ui/select'
import { channelType } from '@prisma/client'
import queryString from 'query-string'

const CreateChannelModal = () => {
    const { isOpen, onClose, type , data} = useModalStore()
    const isModalOpen = isOpen && type === "createChannel"

    const router = useRouter()
    const params = useParams()

    const channeltype = data.channelType

    const formSchema = z.object({
        name: z.string().min(1, "channel name is required").
        refine(name => name !== 'general', {
            message: "channel name cannot be 'general'"
        }),        
        type: z.nativeEnum(channelType)
    })


    const form = useForm({
        defaultValues: {
            name: '',
            type: channeltype || channelType.TEXT
        }, 
        resolver: zodResolver(formSchema)
    })

    useEffect(() => {
        channeltype && form.setValue('type', channeltype)
    }, [channeltype, form])

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url  = queryString.stringifyUrl({
                url: "/api/channels",
                query: { serverId: params?.serverId }
            })
            await axios.post(url, values)

            form.reset()
            router.refresh()
            onClose()
            
        } catch (error: any) {
            console.log(error.response.data)
        }
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }
    
  return (
   <Dialog open={isModalOpen} onOpenChange={handleClose}>
    <DialogContent className="bg-white text-black p-0 overflow-hidden">
      <DialogHeader className='pt-8 px-6'>
        <DialogTitle className='text-2xl text-center font-bold'>create channel</DialogTitle>        
      </DialogHeader>
      <Form { ...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
                <FormField control={form.control} name="name" render={({field}) => (
                    <FormItem>
                        <FormLabel 
                            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                            Channel name
                        </FormLabel>
                        <FormControl>
                            <Input 
                                disabled={isLoading} 
                                className='text-black bg-zinc-300 focus-visible:ring-0 
                                    focus-visible:ring-offset-0 border-0' 
                                placeholder='Enter Channel Name' {...field} autoComplete='off'  />
                        </FormControl>
                        <FormMessage />
                        <FormDescription />
                    </FormItem>
                    )}
                />
                <FormField control={form.control} name="type" render={({field}) => (
                    <FormItem>
                        <FormLabel
                            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                            channel Type
                        </FormLabel>
                            <Select disabled={isLoading} onValueChange={field.onChange} 
                                defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full bg-zinc-300/50 border-0
                                        text-black focus:ring-0 focus:ring-offset-0 ring-offset-0
                                             capitalize outline-none">
                                        <SelectValue placeholder="Select channel type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.values(channelType).map( type => (
                                            <SelectItem key={type} value={type}> {type} </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
                <Button disabled={isLoading} variant='primary'>Create</Button>
            </DialogFooter>
        </form>  
      </Form>

    </DialogContent>
  </Dialog>
  )
}

export default CreateChannelModal