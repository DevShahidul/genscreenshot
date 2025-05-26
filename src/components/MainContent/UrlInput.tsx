import { Globe, Wand2 } from 'lucide-react';
import React, { useState } from 'react';
import { useScreenshot } from '../../context/ScreenshotContext';

const UrlInput: React.FC = () => {
   const [url, setUrl] = useState('');
   const { handleCapture, isLoading } = useScreenshot();

   return (
      <div className="space-y-3">
         <label htmlFor="website-url" className="block text-sm font-medium">
            Website URL
         </label>
         <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Globe size={18} className="text-gray-400" />
            </div>
            <input
               type="url"
               id="website-url"
               className="block w-full pl-10 pr-24 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
               placeholder="https://example.com"
               value={url}
               onChange={(e) => setUrl(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
               <button
                  type="button"
                  className={`h-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-r-md transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 cursor-pointer ${isLoading ? 'opacity-35 pointer-events-none' : 'opacity-100'}`}
                  onClick={() => handleCapture(url)}
                  disabled={isLoading}
               >
                  <Wand2 size={16} />
                  <span>Capture</span>
               </button>
            </div>
         </div>
         <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the full URL including https:// to capture the screenshot
         </p>
      </div>
   );
};

export default UrlInput;