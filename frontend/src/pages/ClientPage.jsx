import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "./api.js";
import { useTranslation } from "../contexts/TranslationContext.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

export default function ClientPage() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [cooldown, setCooldown] = useState(false);
    const [message, setMessage] = useState("");
    const [sessionActive, setSessionActive] = useState(false);
    const [requiresRescan, setRequiresRescan] = useState(false);
    const navigate = useNavigate();
    const { id: qrIdentifier, token: urlToken } = useParams();
    const { t } = useTranslation();

    if (!isMobile) {
        return (
            <>
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <h1>SCAN.MK</h1>
                    <p>{t("thisPageMobileOnly")}</p>
                    <p>{t("scanWithPhone")}</p>
                </div>

                <style>{`
                #root {
                    width: 100%;
                }
            `}</style>
            </>
        );
    }


    useEffect(() => {
        if (urlToken) {
            // validate existing token
            fetch(`${API_URL}/sessions/validate`, {
                method: "GET",
                headers: { "X-Session-Token": urlToken }
            })
                .then(res => res.json())
                .then(valid => {
                    if (valid) {
                        setSessionActive(true);
                        setRequiresRescan(false);
                        setMessage("");
                    } else {
                        setSessionActive(false);
                        setRequiresRescan(true);
                        setMessage(t('sessionExpired'));
                    }
                })
                .catch(() => {
                    setSessionActive(false);
                    setRequiresRescan(true);
                    setMessage(t('errorValidatingSession'));
                });
            return;
        }

        // 🚀 Auto-create session ONLY if this is the initial QR scan
        if (qrIdentifier) {
            // Check if this is the first time visiting this QR (no previous session stored)
            const storedQR = sessionStorage.getItem('currentQR');

            if (storedQR !== qrIdentifier) {
                // This is a new QR scan - create session
                sessionStorage.setItem('currentQR', qrIdentifier);

                fetch(`${API_URL}/sessions/qr/${qrIdentifier}`, { method: "POST" })
                    .then(res => res.json())
                    .then(data => {
                        navigate(`/table/${qrIdentifier}/${data.token}`, { replace: true });
                        setSessionActive(true);
                        setRequiresRescan(false);
                        setMessage("");
                    })
                    .catch(err => {
                        console.error(err);
                        sessionStorage.removeItem('currentQR');
                        setSessionActive(false);
                        setRequiresRescan(true);
                        setMessage(t('errorCreatingSession'));
                    });
            } else {
                // User manually edited URL - don't create new session
                setSessionActive(false);
                setRequiresRescan(true);
                setMessage(t('sessionExpired'));
            }
        } else {
            // no qrIdentifier at all
            setSessionActive(false);
            setRequiresRescan(true);
            setMessage(t('scanQR'));
        }
    }, [qrIdentifier, urlToken, navigate, t]);

    // Function to create session ONLY when QR is scanned
    // const createSessionFromQR = () => {
    //     if (!qrIdentifier) return;
    //
    //     setMessage(t('creatingSession'));
    //
    //     fetch(`${API_URL}/sessions/qr/${qrIdentifier}`, { method: "POST" })
    //         .then(res => res.json())
    //         .then(data => {
    //             // Navigate to URL with new token
    //             navigate(`/table/${qrIdentifier}/${data.token}`, { replace: true });
    //             setSessionActive(true);
    //             setRequiresRescan(false);
    //             setMessage("");
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             setSessionActive(false);
    //             setRequiresRescan(true);
    //             setMessage(t('errorCreatingSession'));
    //         });
    // };

    // Periodic token validation - only if we have an active session
    useEffect(() => {
        if (!urlToken || !sessionActive) return;

        const interval = setInterval(() => {
            fetch(`${API_URL}/sessions/validate`, {
                method: "GET",
                headers: { "X-Session-Token": urlToken }
            })
                .then(res => res.json())
                .then(valid => {
                    if (!valid) {
                        // Token expired, but don't redirect - just update state
                        setSessionActive(false);
                        setRequiresRescan(true);
                        setMessage(t('sessionExpired'));
                    }
                })
                .catch(() => {
                    setSessionActive(false);
                    setRequiresRescan(true);
                    setMessage(t('sessionExpired'));
                });
        }, 5000);

        return () => clearInterval(interval);
    }, [urlToken, sessionActive, t]);

    // Handle call buttons
    const handleCall = (type) => {
        if (!sessionActive || !urlToken) {
            setMessage(t('sessionExpired'));
            return;
        }
        if (cooldown) {
            setMessage(t('pleaseWaitCall'));
            return;
        }

        fetch(`${API_URL}/calls/${qrIdentifier}/${type}`, {
            method: "POST",
            headers: { "X-Session-Token": urlToken }
        })
            .then(async res => {
                if (res.ok) {
                    setMessage(type === "waiter" ? t('waiterCalled') : t('billCalled'));
                    setCooldown(true);
                    setTimeout(() => setCooldown(false), 3 * 60 * 1000);
                } else {
                    const text = await res.text();
                    if (res.status === 401 || res.status === 403) {
                        // Session invalid
                        setSessionActive(false);
                        setRequiresRescan(true);
                        setMessage(t('sessionExpired'));
                    }
                    setMessage(text || t('errorMakingCall'));
                }
            })
            .catch(() => {
                setMessage(t('serverError'));
            });
    };

    return (
        <div className="client-page">
            <header className="page-header">
                <img className="logo" src="/logo.png" alt="logo" height="80px" />
            </header>

            <div className="content-container">
                <h1>{t('welcome')}</h1>

                {/* Show rescan message only */}
                {requiresRescan && (
                    <div style={{ marginBottom: "1rem" }}>
                        <p className="error-message">{message}</p>
                    </div>
                )}

                {!requiresRescan && message && <p className="info-message">{message}</p>}

                <div className="button-container">
                    <button
                        className="action-button"
                        onClick={() => setMessage(t('menuComingSoon'))}
                    >
                        <div className="button-icon">
                            <img src="/menu_symbol.png" height="30px" alt={t('menu')} />
                        </div>
                        <p>{t('menu')}</p>
                    </button>

                    <button
                        className="action-button"
                        onClick={() => handleCall("waiter")}
                        disabled={!sessionActive || cooldown || requiresRescan || !urlToken}
                    >
                        <div className="button-icon">
                            <img src="/waiter_symbol.png" height="30px" alt={t('callWaiter')} />
                        </div>
                        <p>{t('callWaiter')}</p>
                    </button>

                    <button
                        className="action-button"
                        onClick={() => handleCall("bill")}
                        disabled={!sessionActive || cooldown || requiresRescan || !urlToken}
                    >
                        <div className="button-icon">
                            <img src="/bill_symbol.png" height="30px" alt={t('callBill')} />
                        </div>
                        <p>{t('callBill')}</p>
                    </button>
                </div>
            </div>

            <footer className="page-footer">
                <p>{t('poweredBy')} <a href="https://scan.mk" target="_blank" rel="noopener noreferrer">scan.mk</a></p>
            </footer>

            {/* Circular Flag Language Switcher */}
            <LanguageSwitcher />

            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: Boilermaker;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 1.1em !important;
                }

                @font-face {
                    font-family: 'Boilermaker';
                    src: url('/BoilermakerRegular.otf') format('opentype');
                    font-style: normal;
                }

                #root {
                    width: 100%;
                }

                .client-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    width: 100%;
                    position: relative;
                }

                /* Header with logo positioned 5% from top */
                .page-header {
                    position: absolute;
                    top: 5%;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    z-index: 10;
                }

                .logo {
                    height: 80px;
                    width: auto;
                }

                /* Main content centered */
                .content-container {
                    text-align: center;
                    padding: 2.5rem;
                    max-width: 800px;
                    width: 100%;
                    margin: auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    z-index: 5;
                }

                h1 {
                    color: #2c3e50;
                    margin-bottom: 1.5rem;
                    font-size: 1.8em !important;
                    font-weight: 600;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }

                .error-message {
                    color: #e74c3c;
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                    text-shadow: 0 1px 2px rgba(255,255,255,0.8);
                }

                .info-message {
                    color: #2c3e50;
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                    font-weight: 500;
                    text-shadow: 0 1px 2px rgba(255,255,255,0.8);
                }

                .button-container {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    margin-top: 2.5rem;
                }

                .action-button {
                    border: none;
                    background: #222;
                    color: white;
                    cursor: pointer;
                    text-align: center;
                    font-size: 1.1rem;
                    border-radius: 30px;
                    padding: 1rem 5rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(5px);
                    background: rgba(34, 34, 34, 0.9);
                }

                .action-button:hover:not(:disabled) {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                    background: rgba(34, 34, 34, 1);
                }

                .action-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .button-icon {
                    margin-bottom: 0.8rem;
                }

                .action-button p {
                    margin: 0;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                /* Footer at the bottom */
                .page-footer {
                    position: absolute;
                    bottom: 20px;
                    width: 100%;
                    text-align: center;
                    color: #7f8c8d;
                    font-size: 0.9rem;
                    z-index: 5;
                }

                .page-footer a {
                    color: #2c3e50;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.2s ease;
                }

                .page-footer a:hover {
                    color: #1a2530;
                    text-decoration: underline;
                }

                /* Tablet and Mobile Styles */
                @media (max-width: 900px) {
                    .content-container {
                        padding: 2rem 1.5rem;
                    }

                    h1 {
                        font-size: 2rem;
                    }

                    .button-container {
                        gap: 1.5rem;
                        margin-top: 2rem;
                    }

                    .action-button {
                        min-width: 140px;
                        padding: 1.2rem 0.8rem;
                    }

                    .logo {
                        height: 70px;
                    }
                    
                    .page-footer {
                        bottom: 7.5%;
                    }
                }

                @media (max-width: 768px) {
                    .client-page {
                        background: linear-gradient(rgba(245, 247, 250, 0.7), rgba(228, 232, 240, 0.7)),
                        url('/background_tably_4.jpg') no-repeat center center;
                        background-size: cover;
                        padding: 15px;
                    }

                    .button-container {
                        flex-direction: column;
                        gap: 1.2rem;
                        width: 100%;
                        max-width: 300px;
                    }

                    .action-button {
                        min-width: 100%;
                        padding: 1.2rem;
                        flex-direction: row;
                        justify-content: flex-start;
                        gap: 1rem;
                        background: rgba(34, 34, 34, 0.85);
                        border-radius: 100px;
                    }

                    .button-icon {
                        margin-bottom: 0;
                    }

                    .action-button p {
                        font-size: 1.1rem;
                    }

                    .logo {
                        height: 60px;
                    }

                    .page-header {
                        top: 3%;
                    }

                    .page-footer {
                        bottom: 15px;
                        font-size: 0.8rem;
                        color: #2c3e50;
                    }

                    .page-footer a {
                        color: #1a2530;
                    }

                    h1 {
                        color: #2c3e50;
                        text-shadow: 0 1px 3px rgba(255,255,255,0.9);
                    }
                    
                    .page-footer {
                        bottom: 7.5%;
                    }
                    
                    
                }

                @media (max-width: 480px) {
                    .client-page {
                        padding: 15px;
                        background: linear-gradient(rgba(245, 247, 250, 0.6), rgba(228, 232, 240, 0.6)),
                        url('/background-tably_4.jpg') no-repeat center center;
                        background-size: cover;
                    }

                    .content-container {
                        padding: 1.8rem 1.2rem;
                        }

                    h1 {
                        font-size: 1.8rem;
                        margin-bottom: 1.2rem;
                    }

                    .error-message, .info-message {
                        font-size: 1rem;
                    }

                    .button-container {
                        gap: 1rem;
                        margin-top: 1.5rem;
                    }

                    .action-button {
                        padding: 1rem;
                    }

                    .action-button p {
                        font-size: 1rem;
                    }

                    .logo {
                        height: 100px;
                    }

                    .page-header {
                        top: 5%;
                    }

                    .page-footer {
                        bottom: 7.5%;
                    }
                }

                /* Specific styling for very small devices */
                @media (max-width: 380px) {
                    .client-page {
                        padding: 10px;
                    }

                    .content-container {
                        padding: 1.5rem 1rem;
                    }

                    h1 {
                        font-size: 1.6rem;
                    }

                    .action-button {
                        padding: 0.8rem;
                    }

                    .logo {
                        height: 60px;
                    }
                }
            `}</style>
        </div>
    );
}