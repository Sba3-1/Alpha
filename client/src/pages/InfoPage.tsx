import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Shield, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type InfoType = 'security' | 'protection' | 'trust';

const infoContent = {
  ar: {
    security: {
      title: "أمان فائق",
      description: "نحن نضع أمان بياناتك في مقدمة أولوياتنا. نستخدم أحدث تقنيات التشفير لضمان سرية معلوماتك.",
      details: [
        "تشفير البيانات من طرف إلى طرف (End-to-End Encryption).",
        "حماية ضد هجمات DDoS المتقدمة.",
        "تخزين آمن للمفاتيح والرموز البرمجية.",
        "مراقبة أمنية على مدار الساعة."
      ],
      icon: <Shield className="w-16 h-16 text-cyan-400" />
    },
    protection: {
      title: "حماية متكاملة",
      description: "موقعنا محمي بطبقات متعددة من الحماية البرمجية لمنع أي محاولات اختراق أو تسريب.",
      details: [
        "نظام حماية ضد نسخ المحتوى وتسريب البيانات.",
        "تعطيل أدوات المطورين لمنع فحص الكود المصدري.",
        "جدار حماية برمجى متطور (WAF).",
        "تحديثات أمنية دورية وتلقائية."
      ],
      icon: <Lock className="w-16 h-16 text-blue-400" />
    },
    trust: {
      title: "موثوق في العمل الحر",
      description: "نحن جهة معتمدة وموثقة في منصات العمل الحر، مما يضمن لك حقوقك وجودة الخدمة المقدمة.",
      details: [
        "شهادة توثيق معتمدة من منصات العمل الحر.",
        "سجل حافل من المشاريع الناجحة والتقييمات الممتازة.",
        "دعم فني مباشر وسريع لجميع العملاء.",
        "ضمان استرداد الأموال في حال عدم الرضا."
      ],
      icon: <CheckCircle className="w-16 h-16 text-green-400" />
    }
  },
  en: {
    security: {
      title: "Ultra Secure",
      description: "We prioritize your data security. We use the latest encryption technologies to ensure your information remains confidential.",
      details: [
        "End-to-End Data Encryption.",
        "Protection against advanced DDoS attacks.",
        "Secure storage for keys and code tokens.",
        "24/7 security monitoring."
      ],
      icon: <Shield className="w-16 h-16 text-cyan-400" />
    },
    protection: {
      title: "Full Protection",
      description: "Our site is protected by multiple layers of software security to prevent any hacking or leaking attempts.",
      details: [
        "Content protection system to prevent data leaks.",
        "Developer tools disabled to prevent source code inspection.",
        "Advanced Web Application Firewall (WAF).",
        "Regular and automatic security updates."
      ],
      icon: <Lock className="w-16 h-16 text-blue-400" />
    },
    trust: {
      title: "Freelance Trusted",
      description: "We are a verified and certified entity on freelance platforms, ensuring your rights and service quality.",
      details: [
        "Certified verification from freelance platforms.",
        "A track record of successful projects and excellent ratings.",
        "Direct and fast technical support for all clients.",
        "Money-back guarantee in case of dissatisfaction."
      ],
      icon: <CheckCircle className="w-16 h-16 text-green-400" />
    }
  }
};

export default function InfoPage({ params }: { params: { type: string } }) {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<'ar' | 'en'>('en');
  const type = params.type as InfoType;

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as 'ar' | 'en') || "en";
    setLanguage(savedLang);
    window.scrollTo(0, 0);
  }, []);

  const content = infoContent[language][type] || infoContent[language].security;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden">
      <div className="grid-scanner"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <Button 
          variant="ghost" 
          className="mb-8 gap-2 text-muted-foreground hover:text-white"
          onClick={() => setLocation('/')}
        >
          <ArrowRight className={language === 'ar' ? '' : 'rotate-180'} />
          {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </Button>

        <div className="p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-2xl">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="p-6 rounded-3xl bg-white/5 mb-6 border border-white/5">
              {content.icon}
            </div>
            <h1 className="text-5xl font-black text-white mb-6 tracking-tight">
              {content.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {content.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {content.details.map((detail, index) => (
              <div key={index} className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-400/30 transition-all">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                <span className="text-lg font-bold text-white/90">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
