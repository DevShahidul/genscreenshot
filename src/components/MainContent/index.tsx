import { Menu } from 'lucide-react';
import React, { useState } from 'react';
import ScreenshotPreview from './ScreenshotPreview';
import UrlInput from './UrlInput';

interface MainContentProps {
   sidebarOpen: boolean;
   setSidebarOpen: (isOpen: boolean) => void;
}

const MainContent: React.FC<MainContentProps> = ({ sidebarOpen, setSidebarOpen }) => {
   const [imageUrl, setImageUrl] = useState<string | null>(null);
   const [loading, setLoading] = useState<boolean>(false);

   return (
      <div className="flex-1 flex flex-col overflow-hidden">
         {/* Header */}
         <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
               className={`p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${sidebarOpen ? 'md:hidden' : ''
                  }`}
               onClick={() => setSidebarOpen(!sidebarOpen)}
            >
               <Menu size={20} />
               <span className="sr-only">Toggle sidebar</span>
            </button>
            <div className="flex-1 flex justify-center md:justify-start">
               <h1 className="text-xl font-semibold md:ml-2">Website Screenshot Generator</h1>
            </div>
            <div>{/* Right side header content if needed */}</div>
         </header>

         {/* Main content area */}
         <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
               <div className="mb-8">
                  <UrlInput setImageUrl={setImageUrl} setLoading={setLoading} isLoading={loading} />
               </div>
               <ScreenshotPreview screenshotUrl={imageUrl} isLoading={loading} />
            </div>
         </main>
      </div>
   );
};

export default MainContent;