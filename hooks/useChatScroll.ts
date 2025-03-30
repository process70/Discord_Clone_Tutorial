import { useEffect, useState } from "react"

type props = {
    chatRef: React.RefObject<HTMLDivElement>,
    bottomRef: React.RefObject<HTMLDivElement>,
    shouldLoadMore: boolean,
    // initialize a function type
    loadMore: () => void,
    count: number
}

export const useChatScroll = ({chatRef, bottomRef, shouldLoadMore, loadMore, count}: props) => {
    const [hasInitialized, setHasInitialized] = useState(false)

    // Handle scrolling to auto load more messages
    useEffect(() => {
      const topDiv = chatRef?.current

      const handleScroll = () => {
        const scrollTop = topDiv?.scrollTop

        if(scrollTop === 0 && shouldLoadMore) loadMore()

      }
      topDiv?.addEventListener('scroll', handleScroll)
    
      return () => topDiv?.removeEventListener('scroll', handleScroll)
    }, [chatRef, loadMore, shouldLoadMore])    

    // Handle auto-scrolling for new messages
    useEffect(() => {
      const topDiv = chatRef?.current
      const bottomDiv = bottomRef?.current

      const shouldAutoScroll = () => {
        if(!hasInitialized && bottomDiv){
          setHasInitialized(true)
          return true
        }

        // we should not autoscroll when hitting the top 
        if(!topDiv) return false

        const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight

        /* When distanceFromBottom > 100:
        User has scrolled up to read older messages
        Auto-scroll is disabled to not interrupt their reading, 
        otherwise we will scolled down automatically */
        return distanceFromBottom <= 300
      }

      if(shouldAutoScroll()){
        setTimeout(() => {
          bottomRef?.current?.scrollIntoView({
            behavior: "smooth"
          })
        }, 100)
      }
    }, [bottomRef, chatRef, count, hasInitialized])
}