import { createContext, ReactNode, useContext, useEffect, useState, useRef } from "react";
import { Countdown } from "../components/Countdown";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownProviderProps {
    children: ReactNode;
}

interface CountdownContextData {
    minutes: number,
    seconds: number,
    hasFinished: boolean,
    isActive: boolean,
    startCountdown: () => void,
    resetCountdown: () => void
}

export const CountdownContext = createContext({} as CountdownContextData)

export function CountdownProvider({ children }: CountdownProviderProps) {
    const { startNewChallenge } = useContext(ChallengesContext);

    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor((time / 60000) % 60);
    const seconds = Math.floor((time / 1000) % 60);

    const interval = useRef(null);

    function startCountdown(){
        setIsActive(true);

        const limit = new Date(new Date().getTime() + 25 * (60 * 1000))
        interval.current = setInterval(() => {
            setTime(limit.getTime() - new Date().getTime());
        }, 10);

        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        };
    }


    function resetCountdown(){
        setIsActive(false);
        setHasFinished(false);
        clearInterval(interval.current);
        setTime(0);
    }
    useEffect(() => {
        if(isActive){
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, [time < 0])

    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown
        }}>
            {children}
        </CountdownContext.Provider>
    )
}