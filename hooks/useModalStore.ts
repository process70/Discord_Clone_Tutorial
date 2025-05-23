import { Channel, channelType, Server } from "@prisma/client"
import { create } from "zustand"

export type ModalType = "createServer" | "invite" | "editServer" | "member" | 'messageFile' 
        | "createChannel" | "leaveServer" | "deleteServer" | "editChannel" | "deleteChannel" 
        | "deleteMessage"

interface ModalData {
    server?: Server,
    channel?: Channel,
    channelType?: channelType,
    apiUrl?: string,
    query?: Record<string, any>
}

interface ModalStore {
    type: ModalType | null,
    data: ModalData,
    isOpen: boolean,
    onOpen: (type: ModalType, data?: ModalData) => void,
    onClose: ( ) => void
}

export const useModalStore = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({isOpen: true, type, data}),
    onClose: () => set({type: null, isOpen: false})
})) 