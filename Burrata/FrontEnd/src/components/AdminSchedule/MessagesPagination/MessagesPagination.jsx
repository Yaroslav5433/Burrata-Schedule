import React from 'react'
import styles from './MessagesPagination.module.css'
import Button from '@/components/Button/Button'
import { useNotification } from "@/components/ModalWindow/ModalWindow";
import { useCheckAsRead } from '@/hooks/messageMutations';
import PaginationContainer from '@/components/PaginationContainer/PaginationContainer';

function MessagesPagination(props) {
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
    <PaginationContainer
    paginationTitle = 'Messages'>
        {messages.some(Boolean) ? <>
          {messages.map((message, id) => (
            <div key={id} className={styles.container}>
              <div className={styles.topLine}>
                  <span className={styles.nameAndDate}>
                      <p className={styles.author}>{message.username}</p>
                      <time className={styles.date}>
                        <span>{new Date(message.created_at).toLocaleDateString()}</span>
                        <span>
                          {new Date(message.created_at).toLocaleTimeString(
                          "bg-BG", {
                            hour: "2-digit",
                            minute: "2-digit"
                          }
                        )}
                        </span>
                      </time>
                  </span>
                  <Button
                  buttonText = 'Прочетено'
                  buttonStyle = {styles.button}
                  onClick = {() => handleClick(message)}/>
              </div>
              <p className={styles.text}>{message.message}</p>
            </div>))} </>:
            <p>No new messages</p>}
    </PaginationContainer>
  )
}

export default MessagesPagination
