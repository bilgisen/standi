"use client"

import React from "react"

interface VideoBackgroundProps {
  src: string
  className?: string
}

export default function VideoBackground({
  src,
  className = "",
}: VideoBackgroundProps) {
  return (
    <div className={`absolute top-0 left-0 w-full h-full overflow-hidden ${className}`}>
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        controls={false}
      />
    </div>
  )
}
