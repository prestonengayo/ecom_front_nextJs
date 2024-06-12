import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router'; // Assurez-vous d'utiliser next/router si vous utilisez Next.js
import Header from '../components/layout/Header';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Interface pour les données du formulaire
interface IFormInput {
  username: string;
  first_name: string;
  last_name: string;
  adress: string;
  phone: string;
  email: string;
  password: string;
  confirm_password: string;
  file_input: FileList;
}

export default function Home() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter(); // Assurez-vous d'utiliser next/router si vous utilisez Next.js

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const password = watch('password');

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('profile.address', data.adress);
    formData.append('profile.phone', data.phone);

    if (data.file_input && data.file_input.length > 0) {
      formData.append('profile.profile_image', data.file_input[0]);
    }

    try {
      const response = await fetch('https://ecom-back.shop/register/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      const sucessMess = "L&apos;utilisateur a bien été enrégistré"

      if (result && result.id) {
        setSuccessMessage(sucessMess);
        setErrorMessage('');
        setTimeout(() => {
          router.push('/login'); // Redirige vers la page de login après 3 secondes
        }, 3000);
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      setErrorMessage("Une erreur s&apos;est produite");
      setSuccessMessage('');
      console.error('Error:', error);
    }
  };

  return (
    <main>
      <Header />
      <div className="w-11/12 sm:w-full lg:max-w-2xl lg:mx-auto mx-auto mt-8 max-w-2xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mb-5">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Succès ! </strong>
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erreur ! </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              {...register('username', { required: 'Nom d&apos;utilisateur requis' })}
              className={`bg-gray-50 border ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="JohnDoe"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Prénom
              </label>
              <input
                type="text"
                id="first_name"
                {...register('first_name', { required: 'Prénom requis' })}
                className={`bg-gray-50 border ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="John"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nom
              </label>
              <input
                type="text"
                id="last_name"
                {...register('last_name', { required: 'Nom requis' })}
                className={`bg-gray-50 border ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="Doe"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm">{errors.last_name.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Adresse
              </label>
              <input
                type="text"
                id="adress"
                {...register('adress', { required: 'Adresse requise' })}
                className={`bg-gray-50 border ${
                  errors.adress ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="25 Av de Doe"
              />
              {errors.adress && (
                <p className="text-red-500 text-sm">{errors.adress.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Numéro de tel
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone', {
                    required: 'Numéro de tel requis',
                    pattern: {
                    value: /^[0-9]{8,20}$/,
                    message: 'Format du numéro invalide, doit contenir entre 8 et 20 chiffres',
                    },
                })}
                className={`bg-gray-50 border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="0870685478"
                />

              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Photo de profil
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="file_input"
                type="file"
                accept="image/*"
                {...register('file_input')}
              />
            </div>

            <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email requis',
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                  message: 'Format email invalide',
                },
              })}
              className={`bg-gray-50 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          </div>

          

          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password', {
                    required: 'Mot de passe requis',
                    minLength: {
                      value: 8,
                      message: 'Le mot de passe doit contenir au moins 8 caractères',
                    },
                  })}
                  className={`bg-gray-50 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-600 dark:text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm_password"
                  {...register('confirm_password', {
                    required: 'Confirmation du mot de passe requise',
                    validate: (value) =>
                      value === password || 'Les mots de passe ne correspondent pas',
                  })}
                  className={`bg-gray-50 border ${
                    errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                  } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-600 dark:text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </main>
  );
}
