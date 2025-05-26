import React, { createContext, useContext, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;


type Url = string;

interface ScreenshotContextType {
   imageUrl: Url;
   setImageUrl: (url: Url) => void;
   isLoading: boolean;
   setLoading: (status: boolean) => void;
   handleCapture: (url: Url) => void;
   isFullScreen: boolean;
   setIsFullScreen: (status: boolean) => void;
}


const ScreenshotContext = createContext<ScreenshotContextType | undefined>(undefined);

export const ScreenshotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [imageUrl, setImageUrl] = useState<Url>('');
   const [isLoading, setLoading] = useState<boolean>(false);
   const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

   const handleCapture = async (url: Url) => {
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
      <ScreenshotContext.Provider value={{ isLoading, setLoading, imageUrl, setImageUrl, handleCapture, isFullScreen, setIsFullScreen }}>
         {children}
      </ScreenshotContext.Provider>
   )
}

export const useScreenshot = (): ScreenshotContextType => {
   const context = useContext(ScreenshotContext);
   if (context === undefined) {
      throw new Error("useScresnshot must be used within a ScreenshotProvider");
   }
   return context;
}