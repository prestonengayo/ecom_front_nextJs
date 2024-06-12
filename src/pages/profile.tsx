import React, { useState, useEffect, FormEvent } from 'react';
import Header from '../components/layout/Header';
import {Alert} from "../components/ui/Alert";
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  address: string;
  phone: string;
  profile_image: string | null;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile;
}

interface OrderItem {
  id: number;
  product_id: number;
  title: string;
  price: string;
  quantity: number;
  image_url: string;
}

interface Order {
  id: number;
  created_at: string;
  total_price: string;
  items: OrderItem[];
}

const Profile: React.FC = () => {
  const { isAuthenticated, refreshToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedFields, setUpdatedFields] = useState<Partial<User> & Partial<UserProfile>>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access');
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          setError('User not found');
          setLoading(false);
          return;
        }

        let profileResponse = await fetch(`https://ecom-back.shop/users/${userId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (profileResponse.status === 401) {
          const refreshed = await refreshToken();
          if (refreshed) {
            profileResponse = await fetch(`https://ecom-back.shop/users/${userId}/`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`
              }
            });
          }
        }

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData = await profileResponse.json();
        setUser(profileData);

        let ordersResponse = await fetch('https://ecom-back.shop/list-orders/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
        });

        if (ordersResponse.status === 401) {
          const refreshed = await refreshToken();
          if (refreshed) {
            ordersResponse = await fetch('https://ecom-back.shop/list-orders/', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`
              }
            });
          }
        }

        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }

        const ordersData = await ordersResponse.json();
        setOrders(ordersData);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, refreshToken]);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      const userId = localStorage.getItem('user_id');
  
      if (!token || !userId) {
        setError('Missing authentication token or user ID');
        return;
      }
  
      // Créer une instance de FormData
      const formData = new FormData();
  
      // Ajouter les champs au FormData
      formData.append('email', updatedFields.email || user?.email || '');
      formData.append('first_name', updatedFields.first_name || user?.first_name || '');
      formData.append('last_name', updatedFields.last_name || user?.last_name || '');
      formData.append('profile.address', updatedFields.address || user?.profile.address || '');
      formData.append('profile.phone', updatedFields.phone || user?.profile.phone || '');
  
      // Ajouter le fichier d'image de profil, le cas échéant
      if (profileImage) {
        formData.append('profile_image', profileImage);
      }
  
      let response = await fetch(`https://ecom-back.shop/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
  
      if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          response = await fetch(`https://ecom-back.shop/users/${userId}/`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access')}`
            },
            body: formData,
          });
        }
      }
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Failed to update profile:', errorResponse);
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }
  
      const updatedProfile = await response.json();
      setUser(updatedProfile);
      setAlertMessage('Profil mis à jour avec succès'); // Définir le message d'alerte
    } catch (err) {
      console.error('Update profile error:', err);
      setError('Failed to update profile');
    }
  };
  

  const handleOrderDelete = async (orderId: number) => {
    try {
      const token = localStorage.getItem('access');
      let response = await fetch(`https://ecom-back.shop/create-order/${orderId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          response = await fetch(`https://ecom-back.shop/create-order/${orderId}/`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access')}`
            }
          });
        }
      }

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
    } catch (err) {
      setError('Failed to delete order');
    }
  };

  const handleInputChange = (field: keyof (User & UserProfile), value: string) => {
    console.log(`Field: ${field}, Value: ${value}`);
    setUpdatedFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  /*if (loading) return <p>Loading...</p>;*/
  if (error) return <p>{error}</p>;
  return (
    <main>
      <Header />
      {alertMessage && (
      <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
    )}
      <div className="w-full text-white mx-auto mt-8 max-w-2xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Ma page Profil</h2>
        {user && (
          <form onSubmit={handleProfileUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input
                  type="email"
                  value={updatedFields.email || user.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prénom</label>
                <input
                  type="text"
                  value={updatedFields.first_name || user.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
                <input
                  type="text"
                  value={updatedFields.last_name || user.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Adresse</label>
                <input
                  type="text"
                  value={updatedFields.address || user.profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Téléphone</label>
                <input
                  type="text"
                  value={updatedFields.phone || user.profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image de profil</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white rounded-md"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Mettre à jour le profil
            </button>
          </form>
        )}

        <h2 className="text-2xl font-semibold mt-8 mb-4">Historique des commandes</h2>
        {orders.length === 0 ? (
          <p>Aucune commande trouvée.</p>
        ) : (
          <ul>
            {orders.map(order => (
              <li key={order.id} className="mb-4 p-4 border border-gray-300 rounded-md">
                <h3 className="text-lg font-semibold">Commande #{order.id}</h3>
                <p>Créée le: {new Date(order.created_at).toLocaleDateString()}</p>
                <p>Prix total: ${order.total_price}</p>
                <ul className="mt-2">
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.quantity} x {item.title}</span>
                      <span>${item.price}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleOrderDelete(order.id)}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Supprimer la commande
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Profile;
