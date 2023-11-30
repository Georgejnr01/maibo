import React from 'react';
import { useTimer } from 'react-timer-hook';

export default function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ 
        expiryTimestamp,
        onExpire: () => console.warn('onExpire called') 
       })
  
   // We will code the JSX later...
   return (
    <div style={{textAlign: 'center'}}>      
      <div style={{fontSize: '32px'}}>
        <span>{String(days).padStart(2, "0")}</span>:
        <span>{String(hours).padStart(2, "0")}</span>:
        <span>{String(minutes).padStart(2, "0")}</span>:
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>
      {/* <p>{isRunning ? 'Running' : 'Not running'}</p> */}
      {/* <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
      <button onClick={() => {
        // Restarts to 5 minutes timer
        const newTimeStamp = new Date(Date.now() + 300 * 1000)
        restart(newTimeStamp, false)
      }}>Restart</button> */}
    </div>
  );
}