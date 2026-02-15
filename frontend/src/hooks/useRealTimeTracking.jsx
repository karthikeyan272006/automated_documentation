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

        const sendUpdate = (active) => {
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
            } else if (status === 'Active') {
                sendUpdate(true);
            }
        }, 30000); // Pulse every 30 seconds

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);

        return () => {
            clearInterval(interval);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
        };
    }, [userId, activeTask, status]);

    return { status, setStatus };
};
