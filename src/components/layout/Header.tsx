import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex sticky top-0 justify-between items-center p-0 w-full z-[1000] shadow-lg">
      <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 w-full">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className='text-white'>
              <DirectionsCarFilledIcon fontSize="large" />
            </span>
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">OCars</span>
          </Link>
          <button 
            onClick={toggleMenu}
            type="button" 
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
            aria-controls="navbar-solid-bg" 
            aria-expanded={isMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
          <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-solid-bg">
            <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
              <li>
                <Link href="/" className={`${pathname === '/' ? 'text-white' : 'text-gray-400'} font-semibold block py-2 px-3 md:p-0 lowercase rounded md:hover:text-white dark:hover:text-white`}>
                  ACCEUIL
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link href="/profile" className={`${pathname === '/profile' ? 'text-white' : 'text-gray-400'} font-semibold block lowercase py-2 px-3 md:p-0 rounded md:hover:text-white dark:hover:text-white`}>
                      PROFIL
                    </Link>
                  </li>
                  <li>
                    <button onClick={logout} className="block py-2 px-3 md:p-0 font-semibold rounded lowercase text-gray-400 md:hover:text-white dark:hover:text-white">
                      DECONNEXION
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" className={`${pathname === '/login' ? 'text-white' : 'text-gray-400'} font-semibold block lowercase py-2 px-3 md:p-0 rounded md:hover:text-white dark:hover:text-white`}>
                      CONNEXION 
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className={`${pathname === '/register' ? 'text-white' : 'text-gray-400'} font-semibold block lowercase py-2 px-3 md:p-0 rounded md:hover:text-white dark:hover:text-white`}>
                      INSCRIPTION
                    </Link>
                  </li>
                </>
              )}
              <li className="relative">
                <Link href="/cart" className={`${pathname === '/cart' ? 'text-white' : 'text-gray-400'} font-semibold block py-2 px-3 md:p-0 rounded md:hover:text-white dark:hover:text-white`}>
                  <ShoppingCartIcon />
                  {totalItems > 0 && (
                    <span className="absolute bottom-4 left-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
