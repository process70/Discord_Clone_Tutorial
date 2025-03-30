"use client"
import { useSocket } from '@/components/SocketProvider'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import queryString from 'query-string'

type Props = {
    queryKey: string,
    apiUrl: string,
    paramKey: 'channelId' | 'conversationId',
    paramValue: string
}

const useChatQueryHook = ({queryKey, apiUrl, paramKey, paramValue}: Props) => {
    const {isConnected} = useSocket()

    const fetchMessages = async({ pageParam = undefined }) => {
        const url = queryString.stringifyUrl({
            url: apiUrl,
            query: {
                /* tell what messages to load the next batch of messages*/
                cursor: pageParam,
                /* This uses computed property names to dynamically set the key based on 
                the paramKey value, Now when paramKey is 'channelId', the query will be 
                { channelId: paramValue } instead of { paramKey: paramValue } */
                [paramKey]: paramValue
            }
        }, {skipNull: true})

        const res = await fetch(url)
        return await res.json()
    }

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: 1000
    })

    return { data, hasNextPage, fetchNextPage, isFetchingNextPage, status }
}
export default useChatQueryHook