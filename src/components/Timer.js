import React, { useRef, useState } from 'react'
import '../styles/timer.css';
// import SettingsModal from './SettingsModal';
import ClockAlarm from '../resources/clock-alarm.mp3';

const Timer = () => {
    const [sessionMinutes, setSessionMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);
    const [isPaused, setIsPaused] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(sessionMinutes * 60);
    const [mode, setMode] = useState('work')
    const [showSettings, setShowSettings] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);
    const intervalRef = useRef(null);
    const audioRef = useRef();

    const initTimer = () => {
        secondsLeftRef.current = sessionMinutes * 60;
        setSecondsLeft(secondsLeftRef.current);
    }

    const switchMode = () => {
        const nextMode = modeRef.current === 'work' ? 'break' : 'work';
        const nextSeconds = nextMode === 'work' ? sessionMinutes * 60 : breakMinutes * 60;

        setMode(nextMode);
        modeRef.current = nextMode;
        setSecondsLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;
    }

    const tick = () => {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }

    // useEffect(() => {
    //     initTimer();

    //     const interval = setInterval(() => {
    //         if (isPaused.current) return;

    //         if (secondsLeft.current === 0) {
    //             return switchMode();
    //         }

    //         tick();
    //     }, 1000)

    //     return () => clearInterval(interval);
    // }, [])

    const triggerAlarm = () => {
        audioRef.current.play();
        switchMode();
        if (autoPlay) {
            startInterval();
        }

        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }, 3000);
    }

    const startInterval = () => {
        isPausedRef.current = true;
        setIsPaused(isPausedRef.current);

        intervalRef.current = setInterval(() => {
            if (isPaused.current) return;

            if (secondsLeftRef.current === 0) {
                // if (!autoPlay) {
                handleOnPauseClick();
                // }
                return triggerAlarm();
            }

            tick();
        }, 1000);
    }

    const handleOnStartClick = () => {
        // initTimer();
        startInterval();
    }

    const handleOnPauseClick = () => {
        clearInterval(intervalRef.current);
        isPausedRef.current = false;
        setIsPaused(isPausedRef.current);
    }

    const handleOnResetClick = () => {
        initTimer();
        clearInterval(intervalRef.current);
        isPausedRef.current = false;
        setIsPaused(false);
    }

    const handleOnSessionInputChange = (e) => {
        if (e.target.value * 1 <= 120) {
            setSessionMinutes(e.target.value);
            secondsLeftRef.current = e.target.value * 60;
            setSecondsLeft(secondsLeftRef.current);
        }
    }

    const handleOnSessionInputLeft = (e) => {
        if (!e.target.value) {
            setSessionMinutes(25);
            secondsLeftRef.current = 25 * 60;
            setSecondsLeft(secondsLeftRef.current);
        }
    }

    const handleOnBreakInputChange = (e) => {
        if (e.target.value * 1 <= 30) {
            setBreakMinutes(e.target.value);
        }
    }

    const handleOnBreakInputLeft = (e) => {
        if (!e.target.value) {
            setBreakMinutes(5);
        }
    }

    const handleOnBackClick = () => {
        setShowSettings(false);
    }

    const handleOnSettingsClick = () => {
        setShowSettings(true);
    }

    const handleOnAutoPlayClick = () => {
        setAutoPlay(!autoPlay);
    }

    const handleOnSkipClick = () => {
        switchMode();
    }

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = Math.floor(secondsLeft % 60);

    const minutesLeftString = minutes.toString().length === 1 ? '0' + minutes : minutes;
    const secondsLeftString = seconds.toString().length === 1 ? '0' + seconds : seconds;

    const renderTimer = () => {
        return (
            <div>
                <audio ref={audioRef} src={ClockAlarm} />
                <div className={'timer-container' + (mode === 'break' ? ' break-session' : '')}>
                    <div className="timer-value">
                        <span>{`${minutesLeftString}:${secondsLeftString}`}</span>
                    </div>
                    <div className="timer-actions">
                        {
                            isPaused ?
                                <button className='action-btn' onClick={handleOnPauseClick}>Pause</button>
                                :
                                <button className={'action-btn' + (isPaused === false ? ' active' : '')} onClick={handleOnStartClick}>Start</button>
                        }
                        <button className='action-btn' onClick={handleOnResetClick}>Reset</button>
                        {
                            mode === 'break' ?
                                <button className='action-btn' onClick={handleOnSkipClick}>Skip</button>
                                : ''
                        }
                    </div>
                </div>
                <div className='settings-btn-container'>
                    <button className='action-btn settings-btn' onClick={handleOnSettingsClick} disabled={isPaused}>
                        Settings
                    </button>
                </div>
            </div>
        );
    }

    const renderSettings = () => {
        return (
            <div className='settings-container'>
                <div className='settings-input-div'>
                    <label className='settings-input-label' htmlFor='session'>Session Minutes: </label>
                    <input
                        className='settings-input'
                        type='number'
                        id='session'
                        value={sessionMinutes}
                        max={120}
                        onChange={handleOnSessionInputChange}
                        onBlur={handleOnSessionInputLeft} />
                </div>
                <div className='settings-input-div'>
                    <label className='settings-input-label' htmlFor="break">Break Minutes: </label>
                    <input
                        className='settings-input'
                        type='number'
                        id='break'
                        max={30}
                        value={breakMinutes}
                        onChange={handleOnBreakInputChange}
                        onBlur={handleOnBreakInputLeft} />
                </div>
                <div className='settings-input-div'>
                    <label className='settings-input-label' htmlFor="autoplay">AutoPlay: </label>
                    <input
                        className='settings-input'
                        type='checkbox'
                        id='autoplay'
                        checked={autoPlay}
                        onChange={handleOnAutoPlayClick}
                    />
                </div>

                <div className='settings-actions-btn-container'>
                    <button className='apply-btn' onClick={handleOnBackClick}>Back</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {
                showSettings ?
                    renderSettings()
                    :
                    renderTimer()
            }
        </div>
    )
}

export default Timer;