"use client"
import { UploadDropzone } from '@/lib/uploadthing';
import React, { useEffect, useState } from 'react'
import "@uploadthing/react/styles.css"
import Image from 'next/image';
import { FileIcon, X } from 'lucide-react';

interface Props {
    onChange: (url?: string) => void,
    value: string,
    endpoints: 'serverImage' | 'messageFile'
}

const FileUpload = ({ value, onChange, endpoints }: Props) => {
/*     let fileType = ''
    let fileValue = ''
    let fileName = ''
    let fileUrl = '' */
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [fileType, setfileType] = useState('pdf');
    const [fileValue, setfileValue] = useState('');
    const [fileName, setfileName] = useState('');
    const [fileUrl, setfileUrl] = useState('');
    useEffect(() => {
      if(value){
        const object = JSON.parse(value)
        setfileName(object.name)
        setfileType(object.name.split('.').pop());
        setfileUrl(object.url)
        console.log({fileName, fileType, fileUrl})
      }
    }, [onChange, value])
    
    if(value && fileUrl !== '' && fileType !== 'pdf'){
        return(
            <div className="relative h-20 w-20">
                <Image src={fileUrl} fill alt='Server Image' className='rounded-full' 
                    onLoadingComplete={() => setIsImageLoaded(true)} 
                    sizes="(max-width: 80px) 100vw, 80px" priority/>
                {isImageLoaded && (<button 
                    type='button' 
                    className='absolute right-0 top-0 h-4 w-4 rounded-full shadow-sm' 
                    onClick={() => {
                        onChange('')
                        setIsImageLoaded(false)
                    }}>
                    <X className='bg-rose-500 text-white p-1 rounded-full'/>
                </button>)}
            </div>)
    }

    if(value && fileUrl !== '' && fileName !== '' && fileType === 'pdf'){
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400'/>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" 
                    className='ml-2 text-sm text-indigo-500 dark:text-indifo-400 hover:underline'>
                        {fileName}
                </a>
                <button type='button' 
                    className='absolute -right-2 -top-2 h-4 w-4 rounded-full shadow-sm' 
                    onClick={() => {
                        onChange('')
                        setIsImageLoaded(false)
                    }}>
                    <X className='bg-rose-500 text-white p-1 rounded-full'/>
                </button>
            </div>
        )
    }
  return (
    <UploadDropzone 
        endpoint={endpoints}                                        
        onClientUploadComplete={(res: any) => {
            //console.log(res[0]?.type)
            //console.log(res[0]?.name)
            const object = {
                name: res[0]?.name,
                type: res[0]?.type,
                url: res[0]?.ufsUrl
            }
            // this is what would be the content stored in database
            onChange(JSON.stringify(object));
        }}
        onUploadError={(error: Error) => {
            console.error("Upload error:", error);
        }}
    />
  )
}

export default FileUpload