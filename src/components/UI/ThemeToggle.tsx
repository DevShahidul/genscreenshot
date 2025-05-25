import { Moon, Sun } from 'lucide-react';
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
   const { theme, toggleTheme } = useTheme();

   return (
      <button
         onClick={toggleTheme}
         className="flex items-center space-x-2 px-3 py-2 w-full rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
         aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
         {theme === 'light' ? (
            <>
               <Moon size={16} className="text-gray-500" />
               <span>Dark Mode</span>
            </>
         ) : (
            <>
               <Sun size={16} className="text-yellow-400" />
               <span>Light Mode</span>
            </>
         )}
      </button>
   );
};

export default ThemeToggle;