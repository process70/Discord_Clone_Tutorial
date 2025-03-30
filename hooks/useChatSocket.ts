import { useSocket } from "@/components/SocketProvider"
import { Member, Message, Profile } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

type socketProps = {
    addKey: string,
    updateKey: string,
    queryKey: string
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
} 

export const useChatSocket = ({addKey, updateKey, queryKey}: socketProps) => {
    const {socket} = useSocket()
    const queryClient = useQueryClient()
    
    useEffect(() => {
      if(!socket){
        return;
      }
      // socket for updating the messages
      socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
        queryClient.setQueryData([queryKey], (oldData: any) => {
            if(!oldData || !oldData.pages || !oldData.pages.length){
                return oldData
            }
            // useInfiniteQuery uses oldData.pages to access the data fetched
            const newData = oldData.pages.map((page: any) => {
              return{
                ...page,
                items: page.items.map((item: MessageWithMemberWithProfile) => {
                    if(item.id === message.id) return message
                    else return item
                })
              }
            })
            return{
                ...oldData,
                pages: newData
            }
        })
      })

      // socket for watching new messages
      socket.on(addKey, (message: MessageWithMemberWithProfile) => {
        queryClient.setQueryData([queryKey], (oldData: any) => {
            if(!oldData || !oldData.pages || !oldData.pages.length){
                // create a new pages array object with items that have that message
                return{
                    pages: [{
                        items: [message]
                    }]
                }
            }
            const newData = [...oldData.pages]
            // we choose the first item because we need to put the new messages at the top
            // newData[0] have items and nextCursor
            newData[0] = {
                ...newData[0],
                items: [
                    message, // put the new created message at the top of items
                    ...newData[0].items
                ]
            }
            return{
                ...oldData,
                pages: newData
            }
        })
      })
    
      return () => {
        socket.off(addKey)
        socket.off(updateKey)
      }
    }, [addKey, queryClient, queryKey, socket, updateKey])
    
}