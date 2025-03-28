'use client'

import { Hammer } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePageHammer() {
    return (
        <motion.div
            animate={{
                rotateZ: [20, -50, 20],
                // y: [0, -20, 0]
            }}
            transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
            }}
            className="mb-4"
            style={{ transformOrigin: "90% 90%" }}
        >
            <Hammer className="w-16 h-16" />
        </motion.div>
    )
}