'use client';

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  LiveKitRoom, 
  VideoConference
} from '@livekit/components-react';
import {  Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

interface props {
    chatId: string,
    video: boolean,
    audio: boolean
}

export default function MediaRoom({chatId, video, audio}: props) {

  const { user } = useUser()
  const [token, setToken] = useState("")

  useEffect(() => {
    let mounted = true;

    if(!user?.firstName || !user?.lastName) return;
    const name = `${user?.firstName} ${user?.lastName}`;
    (async () => {
      try {
        const resp = await fetch(`/api/token?room=${chatId}&username=${name}`);
        const data = await resp.json();
        if (!mounted) return;
        if (data?.token) {
          console.log({token: data?.token})
          setToken(data?.token)
          /* The exclamation mark ! after a variable in TypeScript is called the non-null assertion operator. It tells TypeScript that even though something could be null or undefined, you're certain it has a value. */
          // await roomInstance.connect(process.env.LIVEKIT_URL!, data?.token);
        }
      } catch (e: any) {
        console.error(e.response.data);
      }
    })();
  
    return () => {
      mounted = false;
      // roomInstance.disconnect();
    };
  }, [user, chatId]);

  if (token === '') {
    return <div className='flex flex-col items-center justify-center'>
        <Loader2 className='w-7 h-7 text-zinc-500 animate-spin my-4'/>
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Getting token...</p>
    </div>;
  }

  return (
    <LiveKitRoom 
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        video={video}
        audio={audio}
        token={token}
        connect={true}
        data-lk-theme="default"
        style={{ height: '100%' }}
        onDisconnected={(reason) => console.log("Disconnected:", reason)}>
        <CustomVideoConference />
    </LiveKitRoom>
  );
}

function CustomVideoConference() {
    const tracks = useTracks(
      [
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
      ],
      { onlySubscribed: false },
    );
    
    console.log("Available video tracks:", tracks.length);
    
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-0">
          <GridLayout tracks={tracks} className="h-full w-full">
            <ParticipantTile />
          </GridLayout>
        </div>
        <ControlBar className="w-full" />
        <RoomAudioRenderer />
      </div>
    );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}