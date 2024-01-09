// AudioPlayer.js
import React, { useState } from 'react';

const AudioPlayer = ({ audioSrc, play }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.createRef();

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div>
            <audio ref={audioRef} src={audioSrc} />
            <button onClick={handlePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>
    );
};

export default AudioPlayer;
