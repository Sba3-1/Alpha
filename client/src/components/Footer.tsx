import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 mt-auto border-t border-border/50 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Logo and Trust Badge */}
          <a 
            href="https://image2url.com/r2/default/files/1772540060349-e3e63854-4c1f-49d7-99f2-bb16f294fc1e.png" 
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

          {/* Links and Info */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            <Link href="/terms">
              <span className="text-sm font-semibold text-foreground/80 hover:text-cyan-400 transition-colors cursor-pointer">
                الشروط والأحكام | Terms & Conditions
              </span>
            </Link>
            <span className="text-foreground/60 text-sm">•</span>
            <span className="text-xs text-foreground/60">
              © 2026 متجر ألفا - Alpha Store. جميع الحقوق محفوظة.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
