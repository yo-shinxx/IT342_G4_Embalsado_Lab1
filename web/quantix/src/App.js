import React, { useState } from 'react';
import './App.css';

// components
import QHeader from './components/QHeader';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="app">
      <QHeader />
      
      <main className="main-container">
        <div className="content-left">
          <section className="hero-section">
            <h1 className="hero-title">
              Welcome to <span className="highlight">Quantix</span>
            </h1>
            <p className="hero-subtitle">
              Centralized Inventory Management System for CIT-U
            </p>
            <p className="hero-description">
              A comprehensive platform integrating backend services, web applications for coordinators, 
              and mobile applications for NAS personnel within the university environment.
            </p>
          </section>

        </div>

        <div className="content-right">
          <LoginForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;