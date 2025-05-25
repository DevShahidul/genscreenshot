import { Maximize2 } from 'lucide-react';
import React, { useState } from 'react';

const FullscreenSwitch: React.FC = () => {
   const [isFullscreen, setIsFullscreen] = useState(false);

   return (
      <div className="space-y-2">
         <div className="flex items-center justify-between">
            <label htmlFor="fullscreen-switch" className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
               <Maximize2 size={16} className="text-gray-500 dark:text-gray-400" />
               <span>Fullscreen</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
               <input
                  type="checkbox"
                  id="fullscreen-switch"
                  className="sr-only peer"
                  checked={isFullscreen}
                  onChange={() => setIsFullscreen(!isFullscreen)}
               />
               <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
         </div>
         <p className="text-xs text-gray-500 dark:text-gray-400">Capture the entire webpage, including content below the fold.</p>
      </div>
   );
};

export default FullscreenSwitch;