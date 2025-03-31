"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

export const AnimateHeight = ({ children }: { children: ReactNode }) => {
    return (
        <motion.div
            initial={false}
            animate={{ height: "auto" }}
            style={{ height: "auto" }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        >
            <div className="overflow-hidden">
                {children}
            </div>
        </motion.div>
    )
} 