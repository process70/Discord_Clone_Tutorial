"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useForm } from 'react-hook-form'

import * as z from 'zod'
import {zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import FileUpload from '../FileUpload'

import axios from 'axios'
import { useRouter } from 'next/navigation'

const InitialModal = () => {

    const router = useRouter()

    const formSchema = z.object({
        name: z.string().min(1, "server name is required"),
        imageUrl: z.string().min(1, "server image is required")
    })

    const form = useForm({
        defaultValues: {
            name: '',
            imageUrl: ''
        }, 
        resolver: zodResolver(formSchema)
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/servers', values)

            form.reset()
            router.refresh()
            window.location.reload()

        } catch (error: any) {
            console.log(error.response.data)
        }
    }
  return (
    <Dialog open={true}>
    <DialogContent className="bg-white text-black p-0 overflow-hidden">
      <DialogHeader className='pt-8 px-6'>
        <DialogTitle className='text-2xl text-center font-bold'>Customize Your Server</DialogTitle>        
        <DialogDescription className='text-center text-sm text-zinc-500'>
            Give your server a name and an image, you can always change it later  
        </DialogDescription>
      </DialogHeader>
      <Form { ...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
                <div className="flex items-center justify-center text-center">
                    <FormField control={form.control} name="imageUrl" render={({field}) => (
                        <FormItem>                            
                            <FormControl>
                                <FileUpload value={field.value} onChange={field.onChange} 
                                    endpoints='serverImage' />
                            </FormControl>
                            <FormMessage />
                            <FormDescription />
                        </FormItem>
                        )}
                    />
                </div>
                <FormField control={form.control} name="name" render={({field}) => (
                    <FormItem>
                        <FormLabel 
                            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                            Server name
                        </FormLabel>
                        <FormControl>
                            <Input 
                                disabled={isLoading} 
                                className='text-black bg-zinc-300 focus-visible:ring-0 
                                    focus-visible:ring-offset-0 border-0' 
                                placeholder='Enter Server Name' {...field} autoComplete='off'  />
                        </FormControl>
                        <FormMessage />
                        <FormDescription />
                    </FormItem>
                    )}
                />
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

export default InitialModal