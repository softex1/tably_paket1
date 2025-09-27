// src/pages/ContactPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../contexts/TranslationContext.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    const phoneNumber = "+389 74 226 613";
    const supportEmail = "support@scan.mk";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("");

        // Simulate form submission (you can integrate with your backend email service)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            // Here you would typically send the data to your backend
            // For now, we'll just show a success message
            setSubmitStatus("success");
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
        } catch (error) {
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackClick = () => {
        navigate(-1); // Go back to previous page
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminData');
        navigate("/login");
    };

    const handleCallSupport = () => {
        window.location.href = `tel:${phoneNumber}`;
    };

    const handleEmailSupport = () => {
        window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject || 'Support Request')}&body=${encodeURIComponent(message || '')}`;
    };

    return (
        <div className="contact-page">
            {/* Navbar */}

            <nav className="dashboard-navbar">
                <div className="navbar-content">
                    <h1>{t('contactDashboard')}</h1>
                    <div className="navbar-nav">

                        <div className="back" onClick={handleBackClick}>
                            <b>{t('back')}</b>
                        </div>

                        {/* Logout Button */}
                        <button className="logout-btn" onClick={handleLogout}>
                            {t('logout')}
                        </button>

                        {/* Language Selector in Navbar */}
                        <div className="navbar-language-selector">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="title-contact">
                <h2>{t('getInTouch')}</h2>
                <p>{t('contactDescription')}</p>
            </div>
            {/* Main Content */}
            <main className="contact-content">

                <div className="contact-container">



                    {/* Contact Information Section */}
                    <section className="contact-info">


                        <div className="contact-methods">
                            <div className="contact-method">
                                <div className="method-icon">📞</div>
                                <div className="method-details">
                                    <h3>{t('callUs')}</h3>
                                    <p className="phone-number" onClick={handleCallSupport}>
                                        {phoneNumber}
                                    </p>
                                </div>
                            </div>

                            <div className="contact-method">
                                <div className="method-icon">✉️</div>
                                <div className="method-details">
                                    <h3>{t('emailUs')}</h3>
                                    <p className="email-address" onClick={handleEmailSupport}>
                                        {supportEmail}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact Form Section */}
                    <section className="contact-form-section">
                        <h2>{t('sendMessage')}</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{t('yourName')} *</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('yourEmail')} *</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{t('subject')} *</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-group">
                                <label>{t('message')} *</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows="6"
                                    required
                                    disabled={isSubmitting}
                                    placeholder={t('messagePlaceholder')}
                                />
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('sending') + "..." : t('sendMessage')}
                            </button>

                            {submitStatus === "success" && (
                                <div className="success-message">
                                    ✅ {t('messageSentSuccess')}
                                </div>
                            )}

                            {submitStatus === "error" && (
                                <div className="error-message">
                                    ❌ {t('messageSentError')}
                                </div>
                            )}
                        </form>
                    </section>
                </div>
            </main>

            <style>{`
                #root {
                    width: 100%;
                }
                
                .title-contact {
                    text-align: center;
                    font-size: 1rem;
                    line-height: 1;
                }
                
                .contact-page {
                    min-height: 100vh;
                    background: #f5f7fa;
                    font-family: 'OpenSans', 'Segoe UI', sans-serif;
                }

                /* Navbar Styles */
                .dashboard-navbar {
                    background: #222;
                    color: white;
                    padding: 1rem 0;
                    width: 100%;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
        
                .navbar-content {
                    width: 99%;
                    // margin: 0 auto;
                    // padding: 0 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            
                .navbar-content h1 {
                    margin: 0;
                    font-size: 1.8rem;
                    font-weight: 600;
                    color: white;
                    padding-left: 1%;
                }
            
                .navbar-nav {
                    display: flex;
                    flex-direction: row;
                    gap: 1rem;
                    align-items: center;
                }

                .back {
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    background: #555;
                    border-radius: 5px;
                    transition: background 0.3s ease;
                }

                .back:hover {
                    background: #777;
                }

                .logout-btn {
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background 0.3s ease;
                }

                .logout-btn:hover {
                    background: #c0392b;
                }

                /* Main Content */
                .contact-content {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .contact-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    align-items: start;
                }

                .contact-info h2,
                .contact-form-section h2 {
                    color: #2c3e50;
                    margin-bottom: 1rem;
                    font-size: 1.8rem;
                }

                .contact-info p {
                    color: #7f8c8d;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }

                .contact-methods {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .contact-method {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1.5rem;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    transition: transform 0.2s ease;
                }

                .contact-method:hover {
                    transform: translateY(-2px);
                }

                .method-icon {
                    font-size: 2rem;
                    margin-top: 0.5rem;
                }

                .method-details h3 {
                    margin: 0 0 0.5rem 0;
                    color: #2c3e50;
                }

                .method-details p {
                    margin: 0.5rem 0;
                    color: #34495e;
                    font-weight: 500;
                }

                .phone-number,
                .email-address {
                    cursor: pointer;
                    color: #3498db !important;
                    text-decoration: underline;
                    transition: color 0.3s ease;
                }

                .phone-number:hover,
                .email-address:hover {
                    color: #2980b9 !important;
                }

                .method-details small {
                    color: #7f8c8d;
                    font-size: 0.8rem;
                }

                /* Contact Form */
                .contact-form-section {
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .contact-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-group label {
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .form-group input,
                .form-group textarea {
                    padding: 0.8rem;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 1rem;
                    transition: border-color 0.3s ease;
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #3498db;
                }

                .form-group input:disabled,
                .form-group textarea:disabled {
                    background-color: #f5f5f5;
                    cursor: not-allowed;
                }

                .submit-btn {
                    background: #27ae60;
                    color: white;
                    border: none;
                    padding: 1rem;
                    border-radius: 5px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                .submit-btn:hover:not(:disabled) {
                    background: #219a52;
                }

                .submit-btn:disabled {
                    background: #95a5a6;
                    cursor: not-allowed;
                }

                .success-message {
                    background: #d4edda;
                    color: #155724;
                    padding: 1rem;
                    border-radius: 5px;
                    text-align: center;
                }

                .error-message {
                    background: #f8d7da;
                    color: #721c24;
                    padding: 1rem;
                    border-radius: 5px;
                    text-align: center;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .title-contact {
                        padding: 0 2%;
                    }
                    
                    .contact-container {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .navbar-content {
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .navbar-nav {
                        flex-wrap: wrap;
                        justify-content: center;
                    }

                    .contact-content {
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}