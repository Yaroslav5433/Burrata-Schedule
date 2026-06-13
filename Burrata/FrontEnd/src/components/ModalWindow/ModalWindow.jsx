import React, { useContext, useState, createContext } from 'react'
import styles from './ModalWindow.module.css'

const NotificationContext = createContext();

export function ModalWindow(props) {
    const {
        children
    } = props

    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);


    const showNotification = (text) => {
        setMessage(text);
        setVisible(true);
    
        setTimeout(() => {
          setVisible(false);
        }, 3000);
      };


    return (
    <NotificationContext.Provider value={{ showNotification }}>
        {children}
    
        {visible && (
        <div className={styles.modal}>
            {message}
        </div>
        )}
    </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}
