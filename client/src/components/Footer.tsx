import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-auto border-t border-border/50 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
        <a 
          href="https://freelance.sa/certificate-validation/certificate-validation-details/FL-203169945" 
          target="_blank" 
          rel="noopener noreferrer"
          className="transition-transform hover:scale-105 flex flex-col items-center gap-2"
        >
          <img 
            src="/freelance-logo.png" 
            alt="موثوقين في العمل الحر" 
            className="h-16 md:h-20 object-contain"
          />
          <span className="text-sm font-bold text-cyan-400">موثوقين في العمل الحر</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
