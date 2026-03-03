import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-auto border-t border-border/50 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
        <a 
          href="https://freelance.sa/user/freelancer/0c47602c-3977-454b-847c-54831778f5a8/certificate" 
          target="_blank" 
          rel="noopener noreferrer"
          className="transition-transform hover:scale-105"
        >
          <img 
            src="/pasted_file_bs36WJ_image.png" 
            alt="شعار العمل الحر السعودي" 
            className="h-16 md:h-20 object-contain"
          />
        </a>
        <p className="text-sm text-muted-foreground font-medium">
          © {new Date().getFullYear()} ALPHA. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
