import React from 'react'
import styles from './MessageContainer.module.css'
import Button from '@/components/Button/Button'

function MessageContainer(props) {
  const {
    message,
    onButtonClick,
  } = props

  return (
    <div className={styles.message_container}>
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
            onClick = {onButtonClick}/>
        </div>
        <p className={styles.messages_text}>{message.message}</p>
    </div>
  )
}

export default MessageContainer
