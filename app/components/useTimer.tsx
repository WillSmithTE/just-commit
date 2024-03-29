import React from 'react'

export const useTimer = (initialState = 0) => {
    const [timer, setTimer] = React.useState(initialState)
    const [isActive, setIsActive] = React.useState(false)
    const [isPaused, setIsPaused] = React.useState(false)
    const countRef = React.useRef(null)

    const handleStart = () => {
        setIsActive(true)
        setIsPaused(true)
        countRef.current = setInterval(() => {
            setTimer((timer) => timer + 1)
        }, 1000)
    }

    const handlePause = () => {
        clearInterval(countRef.current)
        setIsPaused(false)
    }

    const handleResume = () => {
        setIsPaused(true)
        countRef.current = setInterval(() => {
            setTimer((timer) => timer + 1)
        }, 1000)
    }

    const handleReset = () => {
        clearInterval(countRef.current)
        setIsActive(false)
        setIsPaused(false)
        setTimer(0)
    }

    return { timer, isActive, isPaused, handleStart, handlePause, handleResume, handleReset }
}

export const formatTime = (timer: number) => {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = Math.floor(timer / 60)
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

    return `${getHours}:${getMinutes}:${getSeconds}`
}
