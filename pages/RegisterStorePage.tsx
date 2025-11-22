import React, { useState, useContext, FormEvent } from 'react';
import { AppContext } from '../context/AppContext';
import LocationPicker from '../components/LocationPicker';

interface FormData {
  telegramId: string;
  ownerId: string;
  contactNumber: string;
  location: { lat: number; lng: number } | null;
  address: string;
}

// Updated STEPS to use the new 'map' type and corrected labels.
const STEPS: { id: keyof FormData; label: string; type: string; placeholder?: string }[] = [
  { id: 'telegramId', label: 'آیدی چنل تلگرام', type: 'text', placeholder: 'مثال: qbazz_shop' },
  { id: 'ownerId', label: 'کد ملی صاحب فروشگاه', type: 'text', placeholder: 'کد ملی ۱۰ رقمی را وارد کنید' },
  { id: 'contactNumber', label: 'شماره تماس', type: 'tel', placeholder: 'مثال: 09123456789' },
  { id: 'location', label: 'موقعیت فروشگاه روی نقشه', type: 'map' },
  { id: 'address', label: 'آدرس دقیق فروشگاه', type: 'textarea', placeholder: 'آدرس کامل را به همراه پلاک وارد کنید' },
];

const RegisterStorePage: React.FC = () => {
  const appContext = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    telegramId: '',
    ownerId: '',
    contactNumber: '',
    location: null,
    address: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLocationChange = (coords: { lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, location: coords }));
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('New Store Data:', formData);
    alert('فروشگاه شما با موفقیت ثبت شد! (در حالت نمایشی)');
    appContext?.navigateTo({ name: 'home' });
  };
  
  const currentStepData = STEPS[currentStep];
  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  const renderInput = () => {
    if (currentStepData.type === 'map') {
      return (
        <LocationPicker 
            value={formData.location}
            onChange={handleLocationChange}
        />
      );
    }
      
    // Style updated to match design
    const commonInputClass = "w-full text-center text-lg px-4 py-3 bg-white border-2 border-lime-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-300 transition placeholder:text-gray-500";
    const stepId = currentStepData.id as Exclude<keyof FormData, 'location'>;
    
    const commonProps = {
        name: stepId,
        value: formData[stepId],
        onChange: handleInputChange,
        required: true,
        placeholder: currentStepData.placeholder || '',
    };

    switch (currentStepData.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
            className={`${commonInputClass.replace('text-center', 'text-right')} leading-relaxed`} // Right-align for better readability
          />
        );
      default:
        return (
          <input
            type={currentStepData.type}
            {...commonProps}
            className={commonInputClass}
          />
        );
    }
  }
  
  const isNextDisabled = () => {
      const stepId = currentStepData.id;
      if (stepId === 'location') {
          return !formData.location;
      }
      const value = formData[stepId as Exclude<keyof FormData, 'location'>];
      return !value || value.trim() === '';
  }

  return (
    <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-8">
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-lime-400 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Step Content */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{currentStepData.label}</h2>
              <p className="text-gray-500">مرحله {currentStep + 1} از {STEPS.length}</p>
            </div>
            
            <div className="min-h-[150px] flex items-center justify-center">
              {renderInput()}
            </div>
            
             {/* Navigation Buttons */}
            <div>
              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isNextDisabled()}
                  className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg shadow-sm transition-colors hover:bg-gray-900 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                >
                  بعدی
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isNextDisabled()}
                  className="w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold py-3 rounded-lg shadow-sm transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400"
                >
                  ثبت فروشگاه
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterStorePage;