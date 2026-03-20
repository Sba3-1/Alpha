# دليل نقل مشروع Alpha إلى خادم خاص (alphadev.store)

هذا الدليل يشرح لك كيفية تشغيل مشروعك بشكل مستقل تماماً على خادمك الخاص بعيداً عن Railway.

## 1. المتطلبات الأساسية
يجب أن يكون خادمك الخاص يحتوي على:
- **Docker** و **Docker Compose** مثبتين.
- **Nginx** (اختياري، إذا كنت ستستخدمه كـ Reverse Proxy).

## 2. إعداد ملفات البيئة (.env)
قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع على خادمك وضع فيه القيم التالية:
```env
DATABASE_URL=postgres://user:password@db:5432/alpha_db
PORT=3000
NODE_ENV=production
# أضف أي متغيرات أخرى يحتاجها مشروعك هنا (مثل توكنات ديسكورد)
```

## 3. التشغيل باستخدام Docker Compose
المشروع الآن مجهز للعمل بضغطة زر واحدة. من داخل مجلد المشروع، نفذ الأمر التالي:
```bash
docker-compose up -d --build
```
هذا الأمر سيقوم بـ:
1. بناء صورة المشروع (Dockerfile).
2. تشغيل قاعدة بيانات Postgres مستقلة.
3. تشغيل الموقع وربطه بقاعدة البيانات.

## 4. ربط الدومين (alphadev.store)
إذا كنت تستخدم Nginx، قم بنسخ محتوى ملف `nginx.conf` المرفق إلى إعدادات Nginx في خادمك (`/etc/nginx/sites-available/alphadev.store`) ثم قم بتفعيل الموقع:
```bash
ln -s /etc/nginx/sites-available/alphadev.store /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 5. إعدادات DNS
في لوحة تحكم الدومين الخاص بك (`alphadev.store`):
- أضف سجل من نوع **A Record** يوجه `@` إلى عنوان IP الخاص بخادمك.
- أضف سجل من نوع **CNAME** يوجه `www` إلى `@`.

---
**ملاحظة:** تم تنظيف المشروع من أي ارتباطات بـ Railway لضمان الخصوصية والاستقلالية التامة.
