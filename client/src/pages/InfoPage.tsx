import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Shield, Lock, CheckCircle, Bell, Code, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type InfoType = 'security' | 'protection' | 'trust' | 'notifications' | 'support';

const infoContent = {
  ar: {
    security: {
      title: "أمان فائق",
      description: "نحن نضع أمان بياناتك في مقدمة أولوياتنا. نستخدم أحدث تقنيات التشفير لضمان سرية معلوماتك ومعاملاتك.",
      details: [
        "تشفير البيانات من طرف إلى طرف (End-to-End Encryption) لحماية كاملة.",
        "حماية ضد هجمات DDoS المتقدمة والهجمات السيبرانية.",
        "تخزين آمن للمفاتيح والرموز البرمجية مع تشفير عسكري.",
        "مراقبة أمنية على مدار الساعة بفريق متخصص.",
        "شهادات أمان دولية معتمدة (SSL/TLS).",
        "تحديثات أمنية فورية عند اكتشاف أي ثغرات."
      ],
      icon: <Shield className="w-16 h-16 text-cyan-400" />,
      color: "cyan"
    },
    protection: {
      title: "حماية متكاملة",
      description: "موقعنا محمي بطبقات متعددة من الحماية البرمجية والتقنية لمنع أي محاولات اختراق أو تسريب بيانات.",
      details: [
        "نظام حماية ضد نسخ المحتوى وتسريب البيانات الحساسة.",
        "جدار حماية برمجي متطور (WAF) يفحص جميع الطلبات.",
        "تحديثات أمنية دورية وتلقائية بدون توقف الخدمة.",
        "نسخ احتياطية آمنة ومشفرة للبيانات الهامة.",
        "فحوصات أمنية دورية من قبل متخصصين خارجيين.",
        "سياسات صارمة لحماية خصوصية المستخدمين."
      ],
      icon: <Lock className="w-16 h-16 text-blue-400" />,
      color: "blue"
    },
    trust: {
      title: "موثوق في العمل الحر",
      description: "نحن جهة موثوقة ومعتمدة في منصات العمل الحر لضمان جودة الخدمة.",
      details: [
        "شهادة توثيق معتمدة من منصات العمل الحر الرسمية لضمان حقوقك.",
        "سجل حافل من المشاريع الناجحة والتقييمات الممتازة من العملاء.",
        "دعم فني مباشر وسريع لجميع العملاء والشركاء على مدار الساعة.",
        "ضمان الجودة والالتزام الكامل بالمعايير المتفق عليها في كل مشروع.",
        "شفافية كاملة في جميع المعاملات والتعاقدات لضمان رضاك.",
        "حماية المشتري - نضمن لك استلام الخدمة بالجودة المطلوبة أو استرداد حقك."
      ],
      icon: <CheckCircle className="w-16 h-16 text-green-400" />,
      color: "green"
    },
    notifications: {
      title: "إشعارات فورية",
      description: "ابقَ على اطلاع دائم بجميع أنشطة حسابك وبوتاتك من خلال نظام إشعارات متطور وفوري.",
      details: [
        "إشعارات فورية لجميع الأنشطة المهمة على حسابك.",
        "تنبيهات فورية عند اكتشاف أي محاولات وصول غير مصرح بها.",
        "تحديثات حية عن حالة البوتات والخدمات.",
        "إشعارات مخصصة حسب تفضيلاتك واحتياجاتك.",
        "دعم إشعارات عبر البريد الإلكتروني و Discord.",
        "تقارير تفصيلية عن الأنشطة والإحصائيات."
      ],
      icon: <Bell className="w-16 h-16 text-purple-400" />,
      color: "purple"
    },
    code: {
      title: "أكواد مبسطة",
      description: "سهولة في التعامل والدمج حتى لو لم تكن خبيراً في البرمجة. توثيق شامل وأمثلة عملية.",
      details: [
        "واجهة برمجية (API) سهلة الاستخدام وموثقة بالكامل.",
        "أمثلة عملية وأكواد جاهزة للاستخدام المباشر.",
        "مكتبات برمجية متعددة اللغات (Python, JavaScript, etc).",
        "توثيق شامل مع شروحات فيديو وتعليمية.",
        "دعم فني متخصص لمساعدتك في التطوير والتكامل.",
        "مجتمع نشط من المطورين للتعاون والمساعدة."
      ],
      icon: <Code className="w-16 h-16 text-orange-400" />,
      color: "orange"
    },
    support: {
      title: "دعم متواصل",
      description: "فريق دعم فني متاح على مدار الساعة لمساعدتك في أي وقت وحل جميع مشاكلك بسرعة.",
      details: [
        "فريق دعم فني متخصص متاح 24/7 طوال أيام الأسبوع.",
        "وقت استجابة سريع جداً لجميع الاستفسارات والمشاكل.",
        "دعم متعدد اللغات لخدمة عملاء من جميع أنحاء العالم.",
        "قنوات دعم متنوعة (البريد الإلكتروني، Discord، الدردشة).",
        "حل شامل للمشاكل التقنية والاستفسارات العامة.",
        "تدريب مستمر وتحديثات منتظمة للعملاء."
      ],
      icon: <MessageSquare className="w-16 h-16 text-pink-400" />,
      color: "pink"
    }
  },
  en: {
    security: {
      title: "Ultra Secure",
      description: "We prioritize your data security. We use the latest encryption technologies to ensure your information and transactions remain completely confidential.",
      details: [
        "End-to-End Data Encryption for complete protection.",
        "Protection against advanced DDoS attacks and cyber threats.",
        "Secure storage for keys and code tokens with military-grade encryption.",
        "24/7 security monitoring by specialized teams.",
        "Internationally certified security certificates (SSL/TLS).",
        "Instant security updates when vulnerabilities are discovered."
      ],
      icon: <Shield className="w-16 h-16 text-cyan-400" />,
      color: "cyan"
    },
    protection: {
      title: "Full Protection",
      description: "Our site is protected by multiple layers of software and technical security to prevent any hacking or data leaking attempts.",
      details: [
        "Content protection system to prevent sensitive data leaks.",
        "Advanced Web Application Firewall (WAF) that inspects all requests.",
        "Regular and automatic security updates without service interruption.",
        "Secure and encrypted backups of important data.",
        "Periodic security audits by external specialists.",
        "Strict policies to protect user privacy."
      ],
      icon: <Lock className="w-16 h-16 text-blue-400" />,
      color: "blue"
    },
    trust: {
      title: "Freelance Trusted",
      description: "We are a trusted and certified entity on freelance platforms to ensure service quality.",
      details: [
        "Certified verification from official freelance platforms to guarantee your rights.",
        "A track record of successful projects and excellent ratings from clients.",
        "Direct and fast technical support for all clients and partners 24/7.",
        "Quality assurance and full commitment to agreed standards in every project.",
        "Complete transparency in all transactions and contracts to ensure your satisfaction.",
        "Buyer protection - We guarantee you receive the service at the required quality or refund your money."
      ],
      icon: <CheckCircle className="w-16 h-16 text-green-400" />,
      color: "green"
    },
    notifications: {
      title: "Instant Notifications",
      description: "Stay updated with all your account and bot activities through an advanced and instant notification system.",
      details: [
        "Instant notifications for all important account activities.",
        "Alerts when unauthorized access attempts are detected.",
        "Live updates on bot and service status.",
        "Customized notifications based on your preferences.",
        "Support for email and Discord notifications.",
        "Detailed reports on activities and statistics."
      ],
      icon: <Bell className="w-16 h-16 text-purple-400" />,
      color: "purple"
    },
    support: {
      title: "Continuous Support",
      description: "Technical support team available 24/7 to help you at any time and solve all your problems quickly.",
      details: [
        "Specialized technical support team available 24/7.",
        "Very fast response time for all inquiries and issues.",
        "Multi-language support to serve customers worldwide.",
        "Multiple support channels (email, Discord, chat).",
        "Comprehensive solution for technical issues and general inquiries.",
        "Continuous training and regular updates for customers."
      ],
      icon: <MessageSquare className="w-16 h-16 text-pink-400" />,
      color: "pink"
    }
  }
};

const colorClasses = {
  cyan: "from-cyan-500/10 to-cyan-400/5 hover:from-cyan-500/20 hover:to-cyan-400/10 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]",
  blue: "from-blue-500/10 to-blue-400/5 hover:from-blue-500/20 hover:to-blue-400/10 hover:shadow-[0_0_40px_rgba(96,165,250,0.4)]",
  green: "from-green-500/10 to-green-400/5 hover:from-green-500/20 hover:to-green-400/10 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]",
  purple: "from-purple-500/10 to-purple-400/5 hover:from-purple-500/20 hover:to-purple-400/10 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]",
  orange: "from-orange-500/10 to-orange-400/5 hover:from-orange-500/20 hover:to-orange-400/10 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]",
  pink: "from-pink-500/10 to-pink-400/5 hover:from-pink-500/20 hover:to-pink-400/10 hover:shadow-[0_0_40px_rgba(236,72,153,0.4)]"
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
  const colorClass = colorClasses[content.color as keyof typeof colorClasses];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden">
      <div className="grid-glow" style={{ '--gx': '50%', '--gy': '50%' } as React.CSSProperties}></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <Button 
          variant="ghost" 
          className="mb-8 gap-2 text-muted-foreground hover:text-white"
          onClick={() => setLocation('/')}
        >
          <ArrowRight className={language === 'ar' ? '' : 'rotate-180'} />
          {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </Button>

        <div className={`glass-card p-12 rounded-[3rem] bg-gradient-to-br ${colorClass} transition-all duration-300`}>
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
              <div key={index} className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all hover:bg-white/10">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] flex-shrink-0 mt-2"></div>
                <span className="text-lg font-semibold text-white/90 text-right">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
