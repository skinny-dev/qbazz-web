import React, { useContext } from 'react';
import { Icon } from './Icon';
import { AppContext } from '../context/AppContext';

const Footer: React.FC = () => {
  const appContext = useContext(AppContext);

  const handleLinkClick = (pageName: 'home' | 'registerStore') => (e: React.MouseEvent) => {
    e.preventDefault();
    appContext?.navigateTo({ name: pageName });
  };
  
  const socialLinks = [
    { name: 'instagram', href: '#', label: 'اینستاگرام' },
    { name: 'telegram', href: '#', label: 'تلگرام' },
    { name: 'twitter', href: '#', label: 'توییتر' },
  ];
  
  const quickLinks = [
      { label: 'صفحه اصلی', onClick: handleLinkClick('home') },
      { label: 'ثبت فروشگاه', onClick: handleLinkClick('registerStore') },
      { label: 'درباره ما', onClick: (e: React.MouseEvent) => e.preventDefault() },
      { label: 'تماس با ما', onClick: (e: React.MouseEvent) => e.preventDefault() },
  ];
  
  const categoryLinks = [
      { label: 'زنانه' },
      { label: 'مردانه' },
      { label: 'کیف و کفش' },
      { label: 'پوشاک' },
  ]

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">qbazz</h3>
            <p className="text-sm leading-relaxed">
              کیوبازار، ویترین آنلاین فروشگاه‌های بازار بزرگ تهران. خریدی آسان و مطمئن را تجربه کنید.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white tracking-wider mb-4">دسترسی سریع</h4>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <a href="#" onClick={link.onClick} className="text-sm hover:text-white hover:underline transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white tracking-wider mb-4">دسته‌بندی‌ها</h4>
            <ul className="space-y-2">
              {categoryLinks.map(link => (
                 <li key={link.label}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-sm hover:text-white hover:underline transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact & Trust */}
          <div>
             <h4 className="font-bold text-white tracking-wider mb-4">با ما در ارتباط باشید</h4>
              <ul className="space-y-2 text-sm">
                <li>آدرس: بازار بزرگ تهران</li>
                <li>ایمیل: support@qbazz.com</li>
              </ul>
              <div className="mt-4">
                {/* Placeholder for trust badges */}
                <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-400">نماد اعتماد</span>
                </div>
              </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="mb-4 sm:mb-0">&copy; ۱۴۰۳ تمام حقوق برای کیوبازار محفوظ است.</p>
          <div className="flex space-x-4 space-x-reverse">
             {socialLinks.map(social => (
                <a key={social.name} href={social.href} className="text-gray-400 hover:text-white transition-colors" aria-label={social.label}>
                   <Icon name={social.name} className="w-5 h-5" />
                </a>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
