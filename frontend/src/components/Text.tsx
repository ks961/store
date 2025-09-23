import React from 'react'
import type { ClassValue } from 'clsx'
import { cn } from '@/libs/utils'

type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'

export type TextProps = React.HTMLAttributes<HTMLElement> & {
    as?: TextElement
    children: React.ReactNode
    className?: ClassValue
}

const classNameMap: Record<TextElement, string> = {
    h1: 'text-5xl font-bold',    
    h2: 'text-4xl font-bold',    
    h3: 'text-3xl font-semibold',
    h4: 'text-2xl font-semibold',
    h5: 'text-xl font-medium',   
    h6: 'text-lg font-medium',   
    p: 'text-base text-gray-700',
}

export const Text: React.FC<TextProps> = ({
    as = 'p',
    children,
    className,
    ...props
}) => {

    const elementClassName = cn(classNameMap[as], className)

    return React.createElement(as, {
        className: elementClassName, 
        ...props
    }, children);
}