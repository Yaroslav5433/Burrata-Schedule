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
            <div key={id} className={styles.pagination_element_container}>
              <div className={styles.messages_container_top_line}>
                  <span className={styles.messages_name_and_date}>
                      <p className={styles.messages_author}>{message.username}</p>
                      <time className={styles.messages_date}>
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
                  buttonStyle = {styles.messages_button}
                  onClick = {() => handleClick(message)}/>
              </div>
              <p className={styles.messages_text}>{message.message}</p>
            </div>))} </>:
            <p>No new messages</p>}
    </PaginationContainer>
  )
}

export default MessagesPagination
