// src/components/Notification.jsx
import { useEffect } from 'react';
import { useTranslation } from "../contexts/TranslationContext.jsx";

const Notification = ({ message, type, onClose, duration = 3000 }) => {
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className={`notification ${type} show`}>
            <div className="notification-content">
                <span className="notification-icon">
                    {type === 'success' ? '✅' : type === 'error' ? '❌' : '📞'}
                </span>
                <span className="notification-message">{message}</span>
                <button className="notification-close" onClick={onClose}>×</button>
            </div>

            <style>{`
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    min-width: 300px;
                    max-width: 500px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 1000;
                    transform: translateX(400px);
                    opacity: 0;
                    transition: all 0.3s ease-in-out;
                }

                .notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }

                .notification.success {
                    border-left: 4px solid #27ae60;
                }

                .notification.error {
                    border-left: 4px solid #e74c3c;
                }

                .notification.info {
                    border-left: 4px solid #3498db;
                }

                .notification-content {
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .notification-icon {
                    font-size: 1.2rem;
                }

                .notification-message {
                    flex: 1;
                    font-weight: 500;
                }

                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #7f8c8d;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .notification-close:hover {
                    color: #34495e;
                }

                @media (max-width: 768px) {
                    .notification {
                        left: 20px;
                        right: 20px;
                        min-width: auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default Notification;