import currentProfile from '@/lib/currentProfile'
import prisma from '@/prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import NavigationAction from './NavigationAction'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import NavigationItem from './NavigationItem'
import { UserButton } from '@clerk/nextjs'
import { ToggleMode } from './ToggleMode'

const NavigationSideBar = async() => {
  const profile = await currentProfile()
  if(!profile) redirect('/')

  const servers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })  
  return (
    <div className='space-y-4 flex flex-col items-center h-full text-primary bg-[#E3E5E8]
      dark:bg-[#1E1F22] py-3'>
        <NavigationAction />
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mx-auto w-10" />
        <ScrollArea className="flex-1 w-full">
          {servers.map(server => (
            <div key={server.id} className='mb-4'>
              <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
            </div>
          ))}
        </ScrollArea>
        <div className='pb-3 mt-auto flex flex-col items-center gap-y-3'>
          <ToggleMode />
          <UserButton afterSignOutUrl='/' appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px]'
            }
          }} />
        </div>
    </div>
  )
}

export default NavigationSideBar