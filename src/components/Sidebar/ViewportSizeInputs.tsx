import { Maximize } from 'lucide-react';
import React, { useState } from 'react';

const ViewportSizeInputs: React.FC = () => {
   const [viewport, setViewport] = useState({ width: 1280, height: 800 });

   const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setViewport(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }));
   };

   const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setViewport(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }));
   };

   return (
      <div className="space-y-2">
         <div className="flex items-center space-x-2">
            <Maximize size={16} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium">Viewport Size</span>
         </div>
         <div className="flex space-x-2">
            <div className="flex-1">
               <label htmlFor="width-input" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Width
               </label>
               <input
                  id="width-input"
                  type="number"
                  value={viewport.width}
                  onChange={handleWidthChange}
                  className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  min="1"
               />
            </div>
            <div className="flex-1">
               <label htmlFor="height-input" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Height
               </label>
               <input
                  id="height-input"
                  type="number"
                  value={viewport.height}
                  onChange={handleHeightChange}
                  className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  min="1"
               />
            </div>
         </div>
      </div>
   );
};

export default ViewportSizeInputs;