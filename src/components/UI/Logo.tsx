import { Camera } from 'lucide-react';
import React from 'react';

const Logo: React.FC = () => {
   return (
      <div className="flex items-center space-x-2">
         <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-500 text-white">
            <Camera size={18} />
         </div>
         <span className="text-lg font-semibold">SnapSite</span>
      </div>
   );
};

export default Logo;