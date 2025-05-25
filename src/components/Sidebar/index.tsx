import { X } from 'lucide-react';
import React from 'react';
import Logo from '../UI/Logo';
import ThemeToggle from '../UI/ThemeToggle';
import DeviceSelector from './DeviceSelector';
import FullscreenSwitch from './FullscreenSwitch';
import ViewportSizeInputs from './ViewportSizeInputs';

interface SidebarProps {
   isOpen: boolean;
   setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
   return (
      <>
         {/* Mobile sidebar backdrop */}
         <div
            className={`fixed inset-0 z-20 bg-gray-900/50 transition-opacity duration-200 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
               }`}
            onClick={() => setIsOpen(false)}
         />

         {/* Sidebar */}
         <div
            className={`fixed md:relative z-30 h-full w-64 transform transition-transform duration-200 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
               }`}
         >
            <div className="h-full flex flex-col">
               {/* Sidebar header */}
               <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <Logo />
                  <button
                     className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden"
                     onClick={() => setIsOpen(false)}
                  >
                     <X size={20} />
                  </button>
               </div>

               {/* Sidebar content */}
               <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  <div className="space-y-1">
                     <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Screenshot Options</h3>
                     <div className="mt-3 space-y-5">
                        <FullscreenSwitch />
                        <ViewportSizeInputs />
                        <DeviceSelector />
                     </div>
                  </div>
               </div>

               {/* Sidebar footer */}
               <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <ThemeToggle />
               </div>
            </div>
         </div>
      </>
   );
};

export default Sidebar;