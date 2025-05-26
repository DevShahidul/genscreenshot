import { Download, RefreshCw } from 'lucide-react';
import React from 'react';
import { useScreenshot } from '../../context/ScreenshotContext';

const ScreenshotPreview: React.FC = () => {
   const { imageUrl, isLoading } = useScreenshot();

   const handleDownload = () => {
      const link = document.createElement("a");
      link.href = imageUrl ?? '';
      link.download = "screenshot.png"; // 💡 You can make the filename dynamic if needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Screenshot Preview</h2>
            <button
               className={`flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer ${(!imageUrl && isLoading) && 'pointer-events-none'}`}
               disabled={!imageUrl && isLoading}
               onClick={handleDownload}
            >
               <Download size={16} />
               <span>Download</span>
            </button>
         </div>

         <div className="relative min-h-[400px] border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            {isLoading ? (
               <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                  <div className="flex flex-col items-center space-y-3">
                     <RefreshCw size={24} className="text-blue-500 animate-spin" />
                     <p className="text-sm text-gray-600 dark:text-gray-400">Generating screenshot...</p>
                  </div>
               </div>
            ) : imageUrl ? (
               <img
                  src={imageUrl}
                  alt="Website Screenshot"
                  className="w-full h-auto"
               />
            ) : (
               <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                  <div className="text-center p-6">
                     <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <svg
                           className="w-8 h-8 text-gray-400 dark:text-gray-500"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                           ></path>
                        </svg>
                     </div>
                     <p className="text-gray-600 dark:text-gray-400 mb-2">No screenshot generated yet</p>
                     <p className="text-sm text-gray-500 dark:text-gray-500">
                        Enter a URL above and click Capture to generate a screenshot
                     </p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default ScreenshotPreview;