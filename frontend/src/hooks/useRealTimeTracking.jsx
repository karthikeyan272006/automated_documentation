import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export const useRealTimeTracking = (userId, activeTask) => {
    const [isTracking, setIsTracking] = useState(false);
    const lastActivityRef = useRef(Date.now());
    const [status, setStatus] = useState('Idle');

    useEffect(() => {
        if (!userId) return;

        const handleActivity = () => {
            lastActivityRef.current = Date.now();
            if (status === 'Idle') {
                setStatus('Active');
                sendUpdate(true);
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setStatus('Idle');
                sendUpdate(false);
            } else {
                handleActivity();
            }
        };

        const sendUpdate = (active) => {
            if (!userId) return;
            socket.emit('user_activity', {
                userId,
                active,
                task: activeTask?.title || 'General Work',
            });
        };

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = (now - lastActivityRef.current) / 1000;

            if (diff > 60 && status === 'Active') { // 1 minute idle threshold
                setStatus('Idle');
                sendUpdate(false);
            } else if (status === 'Active' && !document.hidden) {
                sendUpdate(true);
            }
        }, 30000);

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('focus', handleActivity);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('focus', handleActivity);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [userId, activeTask, status]);

    return { status, setStatus };
};
