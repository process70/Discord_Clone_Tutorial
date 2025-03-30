import { useEffect, useState } from "react"
import CreateServerModal from "./modals/CreateServerModal"
import InviteModal from "./modals/InviteModal"
import EditServerModal from "./modals/EditServerModal"
import MembersModal from "./modals/MembersModal"
import CreateChannelModal from "./modals/CreateChannelModal"
import LeaveServerModal from "./modals/LeaveServerModal"
import DeleteServerModal from "./modals/DeleteServerModal"
import EditChannelModal from "./modals/EditChannelModal"
import DeleteChannelModal from "./modals/DeleteChannelModal"
import MessageFileModal from "./modals/MessageFileModal"
import DeleteMessageModal from "./modals/DeleteMessageModal"

type Props = {}

const ModalProvider = () => {
  
  return (
    <>
        <CreateServerModal />
        <InviteModal />
        <EditServerModal />
        <MembersModal />
        <CreateChannelModal />
        <LeaveServerModal />
        <DeleteServerModal />
        <EditChannelModal />
        <DeleteChannelModal />
        <MessageFileModal />
        <DeleteMessageModal />
    </>
  )
}

export default ModalProvider