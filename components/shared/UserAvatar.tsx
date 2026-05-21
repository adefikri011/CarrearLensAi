'use client'

import React from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  className?: string
  imageClassName?: string
  fallbackClassName?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  userId?: string
  src?: string | null
  name?: string | null
  fallbackType?: 'initials' | 'icon'
}

export default function UserAvatar({ 
  className, 
  imageClassName, 
  fallbackClassName,
  size = 'md',
  userId,
  src,
  name,
  fallbackType = 'initials'
}: UserAvatarProps) {
  const { data: session } = useSession()
  
  const userImage = src !== undefined ? src : session?.user?.image
  const userName = name !== undefined ? (name || 'User') : (session?.user?.name || 'User')
  const finalUserId = userId || session?.user?.id || 'default'

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-full',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-24 h-24 rounded-[2rem]',
    xl: 'w-32 h-32 rounded-[2.5rem]'
  }

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-sm',
    lg: 'text-2xl',
    xl: 'text-4xl'
  }

  const iconSizes = {
    sm: 'w-4.5 h-4.5',
    md: 'w-5 h-5',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={cn(
      "shrink-0 bg-black flex items-center justify-center overflow-hidden relative shadow-sm border border-white/10",
      sizeClasses[size],
      className
    )}>
      {userImage ? (
        <Image 
          src={userImage} 
          alt={userName} 
          fill
          className={cn("object-cover", imageClassName)}
          referrerPolicy="no-referrer"
        />
      ) : fallbackType === 'icon' ? (
        <div className={cn("flex items-center justify-center w-full h-full bg-zinc-100 dark:bg-zinc-800", fallbackClassName)}>
          <User className={cn("text-[#1D9E75] stroke-[2.5]", iconSizes[size])} />
        </div>
      ) : (
        <div className={cn("flex items-center justify-center w-full h-full", fallbackClassName)}>
          <span className={cn(
            "font-black text-[#1D9E75] italic leading-none",
            textSizes[size]
          )}>
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}
