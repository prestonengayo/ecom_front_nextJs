import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/layout/Header';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

interface LoginResponse {
  refresh: string;
  access: string;
  user_id: number;
  is_admin: boolean;
}

export default function Login() {
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const loginData = {
      username: identifier,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const result: LoginResponse = await response.json();
      localStorage.setItem('access', result.access);
      localStorage.setItem('refresh', result.refresh);
      localStorage.setItem('user_id', result.user_id.toString());
      localStorage.setItem('is_admin', result.is_admin.toString());

      login(); // Met à jour l'état d'authentification

      setSuccessMessage('Connexion réussie ! Redirection en cours...');
      setErrorMessage('');

      // Redirige vers une page protégée ou la page d'accueil après un délai
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      setErrorMessage('Identifiant ou mot de passe incorrect');
      setSuccessMessage('');
    }
  };

  return (
    <main>
      <Header />
      <div className="w-full mx-auto mt-8 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" onSubmit={handleLogin}>
          <h5 className="text-xl text-center font-medium text-gray-900 dark:text-white">Connexion</h5>
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {errorMessage}
            </div>
          )}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Identifiant</label>
            <input
              type="text"
              name="identifier"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Connexion
          </button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Pas inscrit ? <Link href="/register" className="text-blue-700 hover:underline dark:text-blue-500">Créer un compte</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
