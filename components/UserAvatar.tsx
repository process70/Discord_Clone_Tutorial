import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "./ui/avatar"

interface Props {
    src?: string,
    className?: string
}

const UserAvatar = ({src, className}: Props) => {
  return (
        <Avatar>
            <AvatarImage src={src}
                className={cn( "w-9 h-9 rounded-full md:h-10 md:w-10", className )} />
        </Avatar>
  )
}

export default UserAvatar