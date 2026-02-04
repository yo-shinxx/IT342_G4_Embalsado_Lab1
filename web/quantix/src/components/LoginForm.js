import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Initiating Microsoft OAuth login for:', email);
    
    setTimeout(() => {
      setIsLoading(false);
      alert(`Redirecting to Microsoft OAuth login with CIT-U account: ${email}`);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Access Quantix</h2>
        <p>Sign in with your CIT-U institutional account</p>
      </div>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">CIT-U Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@cit.edu"
            required
            className="form-input"
          />
          <p className="input-hint">Use your university-provided Microsoft account</p>
        </div>

        <div className="form-group">
          <label htmlFor="role">System Role</label>
          <select id="role" className="form-input" defaultValue="">
            <option value="" disabled>Select your role</option>
            <option value="nas">Non-Academic Scholar (NAS)</option>
            <option value="coordinator">Laboratory Coordinator</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={isLoading}
        >
          {isLoading ? 'Redirecting...' : 'Continue with Microsoft OAuth'}
        </button>
      </form>

      <div className="login-info">
        <h4>Authentication Requirements:</h4>
        <ul>
          <li>Valid CIT-U institutional Microsoft account</li>
          <li>Stable internet connection within CIT-U</li>
          <li>Officially assigned NAS or Coordinator role</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginForm;