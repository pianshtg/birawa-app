// src/components/organisms/LoginForm.tsx
import React, { useState } from 'react';
import FormField from '../moleculs/FormField';
import Button from '../atom/Button';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
//const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3030/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-type': 'web', // atau 'mobile' sesuai kebutuhan
        },
        body: JSON.stringify({ email, password }),
        credentials:"include"
      });

    //   const data = await response.json();

      if (response.ok) {
        
        navigate('/dashboard');
      } else {
        // setError(data.message || 'Login failed');
      }
    } catch (error) {
        console.error(error)
      throw new Error;
    }
    
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-5 max-w-md shadow-custom-login bg-white rounded-m,d px-8 pt-6 pb-8 mb-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
      <FormField
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <FormField
        label="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
      />
      <Button type="submit">Login</Button>
      <Link to="/forgotpassword" className="text-center text-primary mt-4 hover:underline">Forgot Password?</Link>
    </form>
  );
};

export default LoginForm;
