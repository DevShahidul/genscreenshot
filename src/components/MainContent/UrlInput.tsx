import { Globe, Wand2 } from 'lucide-react';
import React, { useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;


interface UrlInputProps {
   setImageUrl: (url: string) => void;
   isLoading: boolean;
   setLoading: (status: boolean) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ setImageUrl, isLoading, setLoading }) => {
   const [url, setUrl] = useState('');
   // const [loading, setLoading] = useState(false);

   const handleCapture = async () => {
      if (!url) return;
      setLoading(true);

      try {
         const response = await fetch(`${apiUrl}screenshot?url=${url}`);
         if (!response.ok) throw new Error('Network response was not ok');
         const blob = await response.blob();
         const imageUrl = URL.createObjectURL(blob);
         // console.log("Response from try block: ", blob, imageUrl);

         setImageUrl(imageUrl);
      } catch (error) {
         console.error('Fetch error:', error);
      } finally {
         setLoading(false);
      }
   };

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
                  onClick={handleCapture}
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