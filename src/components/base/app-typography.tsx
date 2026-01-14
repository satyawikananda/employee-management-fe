"use client"

import { cn } from "@/lib/utils"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
}

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  className?: string
}

function H1({ children, className, ...props }: HeadingProps) {
  return (
    <h1
      {...props}
      className={cn(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        className
      )}
    >
      {children}
    </h1>
  )
}

function H2({ children, className, ...props }: HeadingProps) {
  return (
    <h2
      {...props}
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  )
}

function H3({ children, className, ...props }: HeadingProps) {
  return (
    <h3
      {...props}
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  )
}

function H4({ children, className, ...props }: HeadingProps) {
  return (
    <h4
      {...props}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h4>
  )
}

function H5({ children, className, ...props }: HeadingProps) {
  return (
    <h5
      {...props}
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h5>
  )
}

function H6({ children, className, ...props }: HeadingProps) {
  return (
    <h6
      {...props}
      className={cn(
        "scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h6>
  )
}

function P({ children, className, ...props }: ParagraphProps) {
  return (
    <p
      {...props}
      className={cn(
        "leading-7 not-first:mt-6",
        className
      )}
    >
      {children}
    </p>
  )
}

function TextMuted({ children, className, ...props }: ParagraphProps) {
  return (
    <p
      {...props}
      className={cn(
        "text-muted-foreground text-sm",
        className
      )}
    >
      {children}
    </p>
  )
}

export {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  TextMuted
}