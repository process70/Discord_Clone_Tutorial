"use client"
import { Member, Profile, Role } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import UserAvatar from './UserAvatar'
import ActionTooltip from './ActionTooltip'
import { Edit, FileIcon, FileSpreadsheet, FileText, Hash, ShieldAlert, ShieldCheck, Trash } 
from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import * as z  from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import queryString from 'query-string'
import axios from 'axios'
import { useModalStore } from '@/hooks/useModalStore'
import { useParams, useRouter } from 'next/navigation'


interface Props {
    id: string, 
    content: string, 
    member: Member & { profile: Profile}, 
    typeStamp: string, 
    fileUrl: string | null, 
    deleted: boolean, 
    currentMember: Member, 
    isUpdated: boolean, 
    socketUrl: string, 
    socketQuery: Record<string, string>
}

interface FileContent {
    name: string;
    type: string;
    url: string;
}

const ChatItem = ({ id, content, member, typeStamp, fileUrl, deleted,
    currentMember, isUpdated, socketUrl, socketQuery}: Props) => {
        const [fileUrlContent, setFileUrlContent] = useState<FileContent | null>(null);
        const [isEditing, setIsEditing] = useState(false)

        const router = useRouter()
        const params = useParams()

        const isAdmin = currentMember.role === Role.ADMIN
        const isModerator = currentMember.role === Role.MODERATOR
        const isOwner = currentMember.id === member.id
        // check if the message is not deleted
        const candDeleteMessage = !deleted && (isAdmin || isModerator)
        // we cannot edit a file url
        const canEditMessage = !deleted && isOwner && !fileUrlContent?.url
        const isPdf = fileUrlContent?.url && fileUrlContent?.type === "application/pdf"
        const isImage = fileUrlContent?.url && fileUrlContent?.type !== "application/pdf"

        const {onOpen} = useModalStore()

        useEffect(() => {
          const handleEscape = (event: KeyboardEvent) => {
            if(event.key === 'Escape'){
                setIsEditing(false)
            }
          }
          window.addEventListener("keydown", handleEscape)
        
          return () => window.removeEventListener("keydown", handleEscape)
        }, [])
        

        const formSchema = z.object({
            content: z.string().min(1, "content is required")
        })
        
        
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                content: content,
            }, 
        })

        const memberClick = () => {
            // console.log({currentMember: currentMember.id, member: member.id})
            if(currentMember.id === member.id){
                return;
            }
            router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
        }

        const isLoading = form.formState.isSubmitting 

        useEffect(() => {
            form.reset({
                content
            })
        }, [content, form])
        
        const roleIcon = {
            [Role.GUEST]: null,
            [Role.MODERATOR]: <ShieldCheck className='text-indigo-500 w-4 h-4 ml-2' />,
            [Role.ADMIN]: <ShieldAlert className='text-rose-500 w-4 h-4 ml-2' />
        }
        useEffect(() => {
            //let parsed = {}
            if (!fileUrl) return;
            
            try {
                // Check if the content is JSON
                if (fileUrl.startsWith('{')) {
                    //const parsed = JSON.parse(content);
                    setFileUrlContent(JSON.parse(fileUrl));
                }
            } catch (error: any) {
                console.log(error.message)
            }
        }, [fileUrl]);

        const onEditSubmit = async(values: z.infer<typeof formSchema>) => {
            try {
                const url = queryString.stringifyUrl({
                    url: `${socketUrl}/${id}`,
                    query: socketQuery
                })
                await axios.patch(url, values)
                form.reset()
                setIsEditing(false)
            } catch (error: any) {
                console.log("Error editing message:", error.response.data)
            }
        }
        
    return (
        <div className='relative flex items-center group hover:bg-black/5 p-4 transition w-full'>
            <div className="flex group items-start gap-x-2 mr-2">
                <div onClick={memberClick} className="cursor-pointer hover:drop-shadow-md transition">
                    {/* the member who send the message */}
                    <UserAvatar src={member.profile.imageUrl}/>
                </div>
            </div>
            <div className="flex flex-col w-full ">
                <div className="flex group items-center gap-x-2">
                    <div className="flex items-center">
                        <p className="font-semibold text-sm cursor-pointer hover:underline" 
                        onClick={memberClick}>
                            {member.profile.name}
                        </p>
                        <ActionTooltip label={member.role}>
                            {roleIcon[member.role]}
                        </ActionTooltip>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {typeStamp}
                    </span>
                </div>
                {isImage && (
                    <a href={fileUrlContent?.url} target="_blank" rel="noopener noreferrer"
                        className='h-12 w-16 flex rounded-md relative mt-2 border overflow-hidden'>
                         <Image src={fileUrlContent?.url || ''} alt={content} fill className='object-cover' />
                    </a>
                )}
                {isPdf && (
                    <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                        <FileText  className='h-10 w-10 fill-indigo-200 stroke-indigo-400'/>
                        <a href={fileUrlContent.url} target="_blank" rel="noopener noreferrer" 
                            className='ml-2 text-sm text-indigo-500 dark:text-indifo-400 hover:underline'>
                            {fileUrlContent.name}
                        </a>
                    </div>
                )}
                {!fileUrlContent?.url && !isEditing && (
                    <p className={cn(
                        "text-sm text-zinc-600 dark:text-zinc-300",
                        deleted && "italic text-xs mt-1 text-zinc-500 dark:text-zinc-400")}>
                        {content}
                        {isUpdated && !deleted && (
                            <span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400 text-sm'>
                                (edited)
                            </span>
                        )}
                    </p>
                )}
                {isEditing && (
                    <Form {...form}>
                        <form className='flex items-center w-full gap-x-2 pt-2' 
                            onSubmit={form.handleSubmit(onEditSubmit)}>
                            <FormField name="content" control={form.control} render={({field}) => (
                                <FormItem className='flex-1'>
                                    <FormControl className='relative w-full'>
                                        <Input disabled={isLoading} 
                                            className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75
                                            border-none border-0 focus-visible:ring-0 text-zinc-600
                                            focus-visible:ring-offset-0 dark:text-zinc-200' 
                                            placeholder='edit the message' {...field} />
                                    </FormControl>
                                </FormItem>
                            )}>

                            </FormField>
                            <Button disabled={isLoading} size="sm" variant="primary">Save</Button>
                        </form>
                        <span className='text-[10px] text-zinc-400'>
                            press esc to cancel, enter to save
                        </span>
                    </Form>
                )}
            </div>
            {candDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 bg-white dark:bg-zinc-800
                    absolute p-1 -top-2 right-5 border rounded-sm">
                        {canEditMessage && (
                            <ActionTooltip label='Edit' >
                                <Edit className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 
                                hover:text-zinc-600 dark:hover:text-zinc-300 transition' 
                                onClick={() => setIsEditing(true)}/>
                            </ActionTooltip>
                        )}
                        <ActionTooltip label='Delete' >
                            <Trash className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 
                             hover:text-zinc-600 dark:hover:text-zinc-300 transition'
                             onClick={() => onOpen('deleteMessage', {
                                apiUrl: `${socketUrl}/${id}`,
                                query: socketQuery 
                             })}/>
                        </ActionTooltip>
                        
                </div>
            )}
        </div>
    )
}

export default ChatItem