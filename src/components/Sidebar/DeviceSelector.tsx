import { Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { useScreenshot } from '../../context/ScreenshotContext';
import { devicesList } from '../../data/devices';

const DeviceSelector: React.FC = () => {
   const [selectedDevice, setSelectedDevice] = useState<string>('');
   const { setDevice } = useScreenshot();

   const handleSelectedDevice = (value: string): void => {
      setSelectedDevice(value);
      setDevice(value);
   }

   return (
      <div className="space-y-2">
         <div className="flex items-center space-x-2">
            <Smartphone size={16} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium">Device</span>
         </div>
         <select
            value={selectedDevice}
            onChange={(e) => handleSelectedDevice(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
         >
            <option value="">Select a device</option>
            {devicesList.map((device) => (
               <option key={device} value={device}>
                  {device}
               </option>
            ))}
         </select>
         <p className="text-xs text-gray-500 dark:text-gray-400">
            Select a device preset or set custom dimensions above.
         </p>
      </div>
   );
};

export default DeviceSelector;