import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

const LanguageSwitcher = ({ variant = 'navbar' }) => {
    const { language, switchLanguage } = useTranslation();
    const [isAnimating, setIsAnimating] = useState(false);

    const toggleLanguage = () => {
        setIsAnimating(true);
        const newLanguage = language === 'en' ? 'mk' : 'en';
        switchLanguage(newLanguage);

        // Reset animation after transition
        setTimeout(() => setIsAnimating(false), 300);
    };

    // Floating animation for mobile
    useEffect(() => {
        if (variant === 'floating') {
            const element = document.querySelector('.language-switch-floating');
            if (element) {
                element.style.animation = 'float 3s ease-in-out infinite';
            }
        }
    }, [variant]);

    // Floating circle variant (for mobile/tablet)
    if (variant === 'floating') {
        return (
            <div className="language-switch-floating">
                <button
                    className={`language-circle ${language} ${isAnimating ? 'animating' : ''}`}
                    onClick={toggleLanguage}
                    aria-label={`Switch to ${language === 'en' ? 'Macedonian' : 'English'}`}
                >
                    <span className="language-text">
                        {language === 'en' ? 'EN' : 'MK'}
                    </span>
                    <div className="language-glow"></div>
                </button>

                <style>{`
                    
                    .language-switch-floating {
                        position: fixed;
                        bottom: 25px;
                        right: 25px;
                        z-index: 1000;
                    }

                    .language-circle {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        border: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.4rem;
                        font-weight: 600;
                        position: relative;
                        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow:
                                0 8px 32px rgba(0, 0, 0, 0.3),
                                inset 0 2px 4px rgba(255, 255, 255, 0.2);
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }

                    .language-circle.en {
                        background: #f5f5f5;
                        color: white;
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                    }

                    .language-circle.mk {
                        background: #f5f5f5;
                        color: #f1f2f6;
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
                    }

                    .language-text {
                        position: relative;
                        z-index: 2;
                        transition: all 0.3s ease;
                    }


                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-8px);
                        }
                    }

                    /* Mobile styles */
                    @media (max-width: 768px) {
                        .language-switch-floating {
                            bottom: 20px;
                            right: 20px;
                        }

                        .language-circle {
                            width: 65px;
                            height: 65px;
                            font-size: 1.3rem;
                        }
                    }

                    /* Tablet styles */
                    @media (min-width: 769px) and (max-width: 1024px) {
                        .language-switch-floating {
                            bottom: 30px;
                            right: 30px;
                        }

                        .language-circle {
                            width: 75px;
                            height: 75px;
                            font-size: 1.5rem;
                        }
                    }

                    /* Hover effects for non-touch devices */
                    @media (hover: hover) and (pointer: fine) {
                        .language-circle:hover .language-text {
                            transform: scale(1.1);
                        }
                    }
                `}</style>
            </div>
        );
    }

    // Navbar variant - compact circle
    return (
        <div className="language-switch-navbar">
            <button
                className={`language-circle-compact ${language} ${isAnimating ? 'animating' : ''}`}
                onClick={toggleLanguage}
                aria-label={`Switch to ${language === 'en' ? 'Macedonian' : 'English'}`}
            >
                <span className="language-text-compact">
                    {language === 'en' ? 'EN' : 'MK'}
                </span>
            </button>

            <style>{`
                .language-switch-navbar {
                    position: relative;
                    z-index: 1000;
                }

                .language-circle-compact {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    font-weight: 500;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    color: white;
                    text-transform: uppercase;
                    position: relative;
                    overflow: hidden;
                }

                .language-circle-compact.en {
                    border-color: gray;
                }

                .language-circle-compact.mk {
                    border-color: gray;
                }

                .language-text-compact {
                    position: relative;
                    z-index: 2;
                    transition: transform 0.3s ease;
                }

                /* Mobile navbar adaptation */
                @media (max-width: 768px) {
                    .language-switch-navbar {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        z-index: 1000;
                    }

                    .language-circle-compact {
                        display: inline-block;        /* ✅ ensures it respects width/height */
                        width: 50px !important;
                        height: 50px !important;
                        border: 2px solid white;
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                        border-radius: 50%;          /* 50% is cleaner than 100% for circles */
                        padding: 0;                  /* ✅ prevents ellipse from padding */
                        line-height: 0;              /* ✅ avoids unwanted vertical stretching */
                        font-family: SansSerif;
                        color: #222;
                        font-weight: 800;
                    }

                    .language-circle-compact.mk {
                        background: #f5f5f5;
                        color: #1a1a1a;
                        font-family: OpenSans;
                    }
                }

                /* Ripple effect */
                .language-circle-compact::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: translate(-50%, -50%);
                    transition: width 0.3s, height 0.3s;
                }

                .language-circle-compact:hover::before {
                    width: 100%;
                    height: 100%;
                }

                .language-circle-compact:active::before {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </div>
    );
};

export default LanguageSwitcher;