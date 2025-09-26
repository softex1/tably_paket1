// src/hooks/useCallNotifications.js
import { useState, useRef } from 'react';

const useCallNotifications = () => {
    const [notification, setNotification] = useState(null);
    const [notifiedCalls, setNotifiedCalls] = useState(new Set());
    const notifiedCallsRef = useRef(new Set());

    const showNotification = (message, type = 'info', duration = 3000) => {
        setNotification({ message, type, duration });
    };

    const hideNotification = () => {
        setNotification(null);
    };

    const markCallAsNotified = (callId) => {
        const newSet = new Set(notifiedCallsRef.current);
        newSet.add(callId);
        notifiedCallsRef.current = newSet;
        setNotifiedCalls(newSet);
    };

    const hasCallBeenNotified = (callId) => {
        return notifiedCallsRef.current.has(callId);
    };

    const clearNotifiedCalls = () => {
        notifiedCallsRef.current = new Set();
        setNotifiedCalls(new Set());
    };

    return {
        notification,
        showNotification,
        hideNotification,
        markCallAsNotified,
        hasCallBeenNotified,
        clearNotifiedCalls,
        notifiedCalls
    };
};

export default useCallNotifications;