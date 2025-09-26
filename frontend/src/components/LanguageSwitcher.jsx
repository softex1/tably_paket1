import React, { useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

const LanguageSwitcher = ({ variant = 'navbar' }) => {
    const { language, switchLanguage, availableLanguages } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLanguageChange = (langCode) => {
        switchLanguage(langCode);
        setIsOpen(false);
    };

    const getFlagEmoji = (countryCode) => {
        const flagEmojis = {
            'mk': '🇲🇰', // Macedonia flag
            'en': '🇺🇸'  // USA flag
        };
        return flagEmojis[countryCode] || '🏴';
    };

    if (variant === 'navbar') {
        return (
            <div className="navbar-language-switcher">
                <div className={`navbar-language-dropdown ${isOpen ? 'open' : ''}`}>
                    <button className="navbar-current-language" onClick={toggleDropdown}>
                        <span className="flag">{getFlagEmoji(language)}</span>
                        <span className="language-code">{language.toUpperCase()}</span>
                    </button>

                    {isOpen && (
                        <div className="navbar-language-options">
                            {availableLanguages.map((lang) => (
                                <button
                                    key={lang.code}
                                    className={`navbar-language-option ${language === lang.code ? 'active' : ''}`}
                                    onClick={() => handleLanguageChange(lang.code)}
                                >
                                    <span className="flag">{getFlagEmoji(lang.code)}</span>
                                    <span className="language-name">{lang.nativeName}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <style jsx>{`
          .navbar-language-switcher {
            position: relative;
          }

          .navbar-language-dropdown {
            position: relative;
          }

          .navbar-current-language {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            padding: 6px 12px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
          }

          .navbar-current-language:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          .navbar-language-options {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            min-width: 140px;
            margin-top: 5px;
            z-index: 1000;
          }

          .navbar-language-option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 15px;
            width: 100%;
            border: none;
            background: transparent;
            cursor: pointer;
            transition: background 0.2s ease;
            font-size: 0.9rem;
            color: #333;
          }

          .navbar-language-option:hover {
            background: #f5f5f5;
          }

          .navbar-language-option.active {
            background: #e3f2fd;
            font-weight: 600;
          }

          .flag {
            font-size: 1rem;
          }

          .language-code {
            font-weight: 600;
          }

          @media (max-width: 768px) {
            .navbar-current-language {
              padding: 4px 8px;
              font-size: 0.8rem;
            }

            .navbar-language-options {
              min-width: 120px;
            }

            .navbar-language-option {
              padding: 8px 12px;
              font-size: 0.8rem;
            }
          }
        `}</style>
            </div>
        );
    }

    // Bottom corner variant (for ClientPage)
    return (
        <div className="language-switcher-bottom">
            <div className={`language-dropdown ${isOpen ? 'open' : ''}`}>
                {isOpen && (
                    <div className="language-options">
                        {availableLanguages.map((lang) => (
                            <button
                                key={lang.code}
                                className={`language-option ${language === lang.code ? 'active' : ''}`}
                                onClick={() => handleLanguageChange(lang.code)}
                            >
                                <span className="flag">{getFlagEmoji(lang.code)}</span>
                                <span className="language-name">{lang.nativeName}</span>
                            </button>
                        ))}
                    </div>
                )}

                <button className="current-language" onClick={toggleDropdown}>
                    <span className="flag">{getFlagEmoji(language)}</span>
                </button>
            </div>

            <style jsx>{`
                .language-switcher-bottom {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                }

                .language-dropdown {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .current-language {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 2px solid #fff;
                    background: #222;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                }

                .current-language:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
                }

                .language-options {
                    position: absolute;
                    bottom: 60px;
                    right: 0;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                    overflow: hidden;
                    min-width: 120px;
                    margin-bottom: 10px;
                }

                .language-option {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 15px;
                    width: 100%;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    font-size: 0.9rem;
                }

                .language-option:hover {
                    background: #f5f5f5;
                }

                .language-option.active {
                    background: #e3f2fd;
                    font-weight: 600;
                }

                .flag {
                    font-size: 1.2rem;
                }

                @media (max-width: 768px) {
                    .language-switcher-bottom {
                        bottom: 15px;
                        right: 15px;
                    }

                    .current-language {
                        width: 45px;
                        height: 45px;
                        font-size: 1.3rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default LanguageSwitcher;