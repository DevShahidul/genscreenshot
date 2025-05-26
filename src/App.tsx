import { useState } from 'react';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import { ScreenshotProvider } from './context/ScreenshotContext';
import { ThemeProvider } from './context/ThemeContext';

function App () {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ScreenshotProvider>
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <MainContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </ScreenshotProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;