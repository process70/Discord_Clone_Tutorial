import { Menu } from 'lucide-react'
import React from 'react'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from './ui/button'
import NavigationSideBar from './NavigationSideBar'
import ServerSideBar from './ServerSideBar'

type Props = {}

const MobileToggle = ({serverId}: {serverId: string}) => {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="ghost" className='md:hidden' size="icon">
                <Menu />
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className='p-0 flex gap-0'>
            <div className="w-[72px]">
                <NavigationSideBar />
            </div>
            <ServerSideBar serverId={serverId}/>
        </SheetContent>
    </Sheet>

  )
}

export default MobileToggle