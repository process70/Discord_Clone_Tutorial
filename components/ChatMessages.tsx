"use client"
import { Member, Message, Profile } from '@prisma/client'
import React, { Fragment, useEffect, useRef, ElementRef } from 'react'
import ChatWelcome from './ChatWelcome'
import useChatQueryHook from '@/hooks/useChatQueryHook'
import { Loader2, ServerCrash } from 'lucide-react'
import ChatItem from './ChatItem'
import {format} from 'date-fns'
import { useChatSocket } from '@/hooks/useChatSocket'
import { useChatScroll } from '@/hooks/useChatScroll'

type Props = {
    name: string, 
    member: Member, 
    chatId: string, 
    apiUrl: string, 
    socketUrl: string, 
    socketQuery: Record<string, string>, 
    paramKey: 'channelId' | 'conversationId',
    paramValue: string, 
    type: 'channel' | 'conversation'
}
const date_format = 'dd-MM-yyyy, HH:mm:ss'

type messageWithMembersWithProfile = Message & {member: Member & {profile: Profile}}

const ChatMessages = ({name, member, chatId, apiUrl, socketQuery, socketUrl, 
        paramKey, paramValue, type}: Props) => {

    const queryKey = `chat:${chatId}`
    // a key for adding messages
    const addKey = `chat:${chatId}:messages`
    // a key for updating messages
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<ElementRef<"div">>(null)
    const bottomRef = useRef<ElementRef<"div">>(null)

    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useChatQueryHook({
        apiUrl, paramKey, paramValue, queryKey
    })

    useChatSocket({addKey, queryKey, updateKey})
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        /* the reason we put double negation !! is hasNextPage could be undefined*/
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        /* the reason we put data?.pages?.[0] is data?.pages is an array that hap one item */
        count: data?.pages?.[0]?.items?.length ?? 0,
    })

/*     useEffect(() => {
        data?.pages && console.log({hasNextPage})
    }, [data, fetchNextPage, hasNextPage]) */
    
    
    if(status === "loading"){ 
        return (
            <div className="flex flex-col flex-1 items-center justify-center">
                <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4'/>
                <div className="text-xs flex text-zinc-500 dark:text-zinc-400">
                    Loading Messages ...
                </div>
            </div>
        )
    }
    if(status === "error"){ 
        return (
            <div className="flex flex-col flex-1 items-center justify-center">
                <ServerCrash className='h-7 w-7 text-zinc-500 my-4'/>
                <div className="text-xs flex text-zinc-500 dark:text-zinc-400">
                    SomeThing Went Wrong !
                </div>
            </div>
        )
    }

    
  return (
    <div ref={chatRef} className='flex-1 flex flex-col overflow-y-auto py-4'>
        {!hasNextPage && (<div className='flex-1' />)}
        {!hasNextPage && (<ChatWelcome 
            type={type}
            name={name}/>)}
        {hasNextPage && (
            <div className="flex justify-center">
                {isFetchingNextPage ? 
                    <Loader2 className='w-6 h-6 text-zinc-600 my-4 animate-spin'/> : 
                    <button className='text-zinc-500 hover:text-zinc-400 dark:text-zinc-400 
                    dark:hover:text-zinc-300 transition text-xs'
                    onClick={() => fetchNextPage()}>
                        Load previous message
                    </button>}
            </div>
        )}    
        <div className="flex flex-col-reverse mt-auto">
            {data?.pages?.map((group, i) => (
                <Fragment key={i}>
                    {group?.items?.map((message: messageWithMembersWithProfile) => (
                        <ChatItem 
                            key={message.id}
                            id={message.id}
                            currentMember={member}
                            member={message.member}
                            content={message.content}
                            fileUrl={message.fileUrl}
                            deleted={message.delete}
                            typeStamp={format(new Date(message.createdAt), date_format)}
                            isUpdated={message.updatedAt !== message.createdAt}
                            socketUrl={socketUrl}
                            socketQuery={socketQuery}
                        />
                    ))}
                </Fragment>
            ))}
        </div>    
        <div ref={bottomRef} />
    </div>
  )
}

export default ChatMessages