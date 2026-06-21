import React from 'react'
import styles from './MessagesContainer.module.css'
import MessageContainer from '../MessageContainer/MessageContainer'
import { useNotification } from "@/components/ModalWindow/ModalWindow";
import { useCheckAsRead } from '@/hooks/messageMutations';

function MessagesContainer(props) {
  const {
    messages,
  } = props

  const { showNotification } = useNotification()
  const checkAsRead = useCheckAsRead()

  const handleClick = async (msg) => {
    checkAsRead.mutate({id: msg.id}, {
      onError: () => {
        showNotification('Failed to check as read', true)
      }
    })
  } 

  return (
    <>
    <h2 className={styles.messages_title}>Messages</h2>
    <div className={styles.messages_pagination_container}>
      {messages.some(Boolean) ? <>
      {messages.map((msg, i) => (
        <MessageContainer
        message = {msg}
        key={i}
        onButtonClick = {() => handleClick(msg)}/> 
      ))} </>: 
      <p>No new messages</p>}
    </div>
    </>
  )
}

export default MessagesContainer
