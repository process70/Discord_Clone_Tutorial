"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from './ui/form'
import { Input } from './ui/input'
import { Plus, Smile } from 'lucide-react'
import queryString from 'query-string'
import axios from 'axios'
import { useModalStore } from '@/hooks/useModalStore'
import EmojiPicker from './EmojiPicker'


type Props = {
    apiUrl: string,
    /* The Record<string, any> is a utility type in TypeScript that creates an object type 
    with keys of type string and values of type any 
    record type example breakdown:
    const query: Record<string, any> = {
        channelId: "123",
        limit: 50,
        timestamp: new Date(),
        isPrivate: true
    };*/
    query: Record<string, any>,
    name: string,
    type: 'channel' | 'conversation'
}

const ChatInput = ({ apiUrl, name, type, query }: Props) => {
    const {onOpen} = useModalStore()
    const formSchema = z.object({
        content: z.string().min(1)
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ''
        }
    })

    const isLoading = form.formState.isSubmitting

    const Submit = async(values: z.infer<typeof formSchema>) =>{
        try {
            const url = queryString.stringifyUrl({
                url: apiUrl,
                query
            })
            const res = await axios.post(url, values)
            form.reset()
        } catch (error: any) {
            console.log(error.response.data)
        }
    }


  return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(Submit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <div className="relative p-4 pb-6">
                                <button 
                                    type='button' onClick={() => {onOpen("messageFile", {apiUrl, query})}}
                                    className='absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 
                                    dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300
                                    transition rounded-full p-1 flex items-center justify-center'>
                                    <Plus className='text-white dark:text-[#313338]' />
                                </button>
                                <Input {...field} disabled={isLoading}
                                    className='px-14 py-6 bg-zinc-300 dark:bg-zinc-700/75 
                                    border-none focus-visible focus-visible:ring-0 
                                    focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                                    placeholder={`message ${type === "conversation" ? name : '# '+name}`}
                                />
                                <div className="absolute top-7 right-8">
                                    <EmojiPicker 
                                    onChange={(emoji: string) =>field.onChange(`${field.value} ${emoji}`)}/>
                                </div>
                            </div>
                        </FormControl>
                        <FormDescription />
                    </FormItem>
                    )}
                />
            </form>
        </Form>

  )
}
export default ChatInput