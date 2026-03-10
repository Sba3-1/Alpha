import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Language = "ar" | "en";

const translations = {
  ar: {
    title: "الشروط والأحكام",
    backHome: "العودة للرئيسية",
    lastUpdated: "آخر تحديث:",
    introduction: "مرحباً بك في متجر ألفا. يرجى قراءة الشروط والأحكام التالية بعناية قبل استخدام خدماتنا.",
    section1Title: "1. قبول الشروط",
    section1Content: "بمجرد وصولك إلى هذا الموقع واستخدام خدماتنا، فإنك توافق على الالتزام بجميع الشروط والأحكام المذكورة هنا. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.",
    section2Title: "2. استخدام الخدمة",
    section2Content: "أنت توافق على استخدام هذا الموقع فقط للأغراض القانونية وبطريقة لا تنتهك حقوق الآخرين أو تقيد استخدامهم والتمتع بالموقع. السلوك المحظور يشمل المضايقة أو إساءة الاستخدام أو الانتهاك أو الإساءة أو التشهير أو التمييز أو الأغراض غير القانونية.",
    section3Title: "3. المحتوى والملكية الفكرية",
    section3Content: "جميع المحتوى على هذا الموقع، بما في ذلك النصوص والرسومات والشعارات والصور والملفات الصوتية والفيديو، هو ملك متجر ألفا أو مرخص له وهو محمي بموجب قوانين الملكية الفكرية.",
    section4Title: "4. تحديد المسؤولية",
    section4Content: "لا يتحمل متجر ألفا أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية ناشئة عن استخدام أو عدم القدرة على استخدام الموقع أو الخدمات.",
    section5Title: "5. التعديلات على الشروط",
    section5Content: "يحتفظ متجر ألفا بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم نشر التعديلات على هذه الصفحة، وسيتم تحديث تاريخ 'آخر تحديث' وفقاً لذلك.",
    section6Title: "6. الاتصال بنا",
    section6Content: "إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا عبر خادم Discord الخاص بنا أو البريد الإلكتروني.",
  },
  en: {
    title: "Terms and Conditions",
    backHome: "Back to Home",
    lastUpdated: "Last Updated:",
    introduction: "Welcome to Alpha Store. Please read the following terms and conditions carefully before using our services.",
    section1Title: "1. Acceptance of Terms",
    section1Content: "By accessing this website and using our services, you agree to be bound by all the terms and conditions mentioned here. If you do not agree to any of these terms, please do not use the website.",
    section2Title: "2. Use of Service",
    section2Content: "You agree to use this website only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use and enjoyment of the website. Prohibited behavior includes harassment, abuse, violation, defamation, discrimination, or illegal purposes.",
    section3Title: "3. Content and Intellectual Property",
    section3Content: "All content on this website, including text, graphics, logos, images, audio files, and video, is the property of Alpha Store or licensed to it and is protected under intellectual property laws.",
    section4Title: "4. Limitation of Liability",
    section4Content: "Alpha Store shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use or inability to use the website or services.",
    section5Title: "5. Modifications to Terms",
    section5Content: "Alpha Store reserves the right to modify these terms and conditions at any time. Modifications will be posted on this page, and the 'Last Updated' date will be updated accordingly.",
    section6Title: "6. Contact Us",
    section6Content: "If you have any questions about these terms and conditions, please contact us via our Discord server or email.",
  },
};

export default function Terms() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);
  }, []);

  const t = translations[language];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="grid-glow" style={{ '--gx': '50%', '--gy': '50%' } as React.CSSProperties}></div>
      
      {/* Back Navigation */}
      <div className="fixed top-24 left-6 z-40">
        <Link href="/">
          <Button className="gap-2 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 font-bold rounded-lg px-4 py-2 border border-cyan-400/30 transition-all">
            <ArrowLeft className="w-4 h-4" />
            {t.backHome}
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-black text-white mb-4 tracking-tight">
              {t.title}
            </h1>
            <div className="w-24 h-1 bg-cyan-400 mx-auto rounded-full mb-6"></div>
            <p className="text-cyan-400/80 font-medium">
              {t.lastUpdated} 10 مارس 2026
            </p>
          </div>

          {/* Introduction */}
          <div className="glass-card p-8 mb-8 bg-gradient-to-br from-cyan-500/10 to-cyan-400/5 hover:from-cyan-500/15 hover:to-cyan-400/10 transition-all">
            <p className="text-lg text-muted-foreground leading-relaxed text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {t.introduction}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Section 1 */}
            <div className="glass-card p-8 bg-gradient-to-br from-blue-500/10 to-blue-400/5 hover:from-blue-500/15 hover:to-blue-400/10 transition-all">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">{t.section1Title}</h2>
              <p className="text-muted-foreground leading-relaxed text-right">{t.section1Content}</p>
            </div>

            {/* Section 2 */}
            <div className="glass-card p-8 bg-gradient-to-br from-purple-500/10 to-purple-400/5 hover:from-purple-500/15 hover:to-purple-400/10 transition-all">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">{t.section2Title}</h2>
              <p className="text-muted-foreground leading-relaxed text-right">{t.section2Content}</p>
            </div>

            {/* Section 3 */}
            <div className="glass-card p-8 bg-gradient-to-br from-green-500/10 to-green-400/5 hover:from-green-500/15 hover:to-green-400/10 transition-all">
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t.section3Title}</h2>
              <p className="text-muted-foreground leading-relaxed text-right">{t.section3Content}</p>
            </div>

            {/* Section 4 */}
            <div className="glass-card p-8 bg-gradient-to-br from-orange-500/10 to-orange-400/5 hover:from-orange-500/15 hover:to-orange-400/10 transition-all">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">{t.section4Title}</h2>
              <p className="text-muted-foreground leading-relaxed text-right">{t.section4Content}</p>
            </div>

            {/* Section 5 */}
            <div className="glass-card p-8 bg-gradient-to-br from-pink-500/10 to-pink-400/5 hover:from-pink-500/15 hover:to-pink-400/10 transition-all">
              <h2 className="text-2xl font-bold text-pink-400 mb-4">{t.section5Title}</h2>
              <p className="text-muted-foreground leading-relaxed text-right">{t.section5Content}</p>
            </div>

            {/* Section 6 */}
            <div className="glass-card p-8 bg-gradient-to-br from-indigo-500/10 to-indigo-400/5 hover:from-indigo-500/15 hover:to-indigo-400/10 transition-all">
              <h2 className="text-2xl font-bold text-indigo-400 mb-4">{t.section6Title}</h2>
              <p className="text-muted-foreground leading-relaxed text-right">{t.section6Content}</p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 text-center">
            <Link href="/">
              <Button className="gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-lg px-8 py-3 text-lg">
                {t.backHome}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
