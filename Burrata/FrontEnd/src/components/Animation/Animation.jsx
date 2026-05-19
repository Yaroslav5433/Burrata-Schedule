import React from 'react'
import { motion } from "motion/react"

const animations = {
    initial: {opacity: 0},
    animate: {opacity: 1},
    exit: {opacity: 0},
}

function Animation({children})  {
  return (
    <motion.div
    variants = {animations}
    initial='initial'
    animate='animate'
    exit='exit'
    transition={{ duration: 0.7}}>
        {children}
    </motion.div>
  )
}

export default Animation
