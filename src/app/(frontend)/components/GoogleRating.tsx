"use client"

import { Star } from "lucide-react"
import { motion } from "motion/react"

interface GoogleRatingProps {
  rating?: number
}

export default function GoogleRating({ rating = 4.8 }: GoogleRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const stars = [
    ...Array(fullStars).fill("full"),
    ...(hasHalfStar ? ["half"] : []),
    ...Array(emptyStars).fill("empty"),
  ]

  return (
    <div className="p-4">
      <div className="flex items-center space-x-1 mb-1">
        {stars.map((type, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Star
              className={
                type === "full"
                  ? "text-amber-500 fill-amber-500 w-5 h-5"
                  : type === "half"
                  ? "text-amber-500 fill-amber-200 w-5 h-5"
                  : "text-gray-300 w-5 h-5"
              }
            />
          </motion.div>
        ))}
      </div>
      <motion.p
        className="text-base text-gray-700"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {rating} / 5.0
      </motion.p>
    </div>
  )
}
