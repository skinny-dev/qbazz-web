
import React, { useRef, MouseEvent } from 'react';
import { Icon } from './Icon';

interface Coords {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  value: Coords | null;
  onChange: (value: Coords) => void;
}

const MAP_IMAGE_URL = 'https://i.ibb.co/kHbz91T/grand-bazaar-map.jpg';

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentage-based coordinates
    const lat = (y / rect.height) * 100;
    const lng = (x / rect.width) * 100;
    
    onChange({ lat, lng });
  };

  return (
    <div className="w-full space-y-4">
        <p className="text-center text-gray-600">
            مکان فروشگاه خود را روی نقشه مشخص کنید
        </p>
        <div 
            ref={mapRef}
            onClick={handleMapClick}
            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border-2 border-gray-300 bg-gray-100 group"
        >
            <img 
                src={MAP_IMAGE_URL} 
                alt="نقشه بازار بزرگ تهران" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
             <div className="absolute inset-0 bg-black/10"></div>
            {value && (
                <div 
                    className="absolute transform -translate-x-1/2 -translate-y-full"
                    style={{ top: `${value.lat}%`, left: `${value.lng}%` }}
                    aria-label="مکان انتخاب شده"
                >
                    <Icon name="mapPin" className="w-8 h-8 text-red-500 drop-shadow-lg" />
                </div>
            )}
        </div>
        {value ? (
             <p className="text-center text-sm text-green-600 font-semibold animate-pulse">
                موقعیت با موفقیت ثبت شد!
             </p>
        ) : (
             <p className="text-center text-sm text-gray-500">
                برای ثبت موقعیت، روی نقشه کلیک کنید.
             </p>
        )}
    </div>
  );
};

export default LocationPicker;
