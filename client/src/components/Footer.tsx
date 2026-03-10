import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-auto border-t border-border/50 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
        <a 
          href="https://image2url.com/r2/default/files/1772540060349-e3e63854-4c1f-49d7-99f2-bb16f294fc1e.png" 
          target="_blank" 
          rel="noopener noreferrer"
          className="transition-transform hover:scale-105 flex flex-col items-center gap-2"
        >
          <img 
            src="/logo.png" 
            alt="Alpha Logo" 
            className="h-16 md:h-20 object-contain"
          />
          <span className="text-sm font-bold text-cyan-400">موثوقين في العمل الحر</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
