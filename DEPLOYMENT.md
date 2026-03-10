# دليل نشر مشروع Alpha على خادم خاص

هذا الدليل سيساعدك على تشغيل مشروعك على خادمك الخاص وربطه بالدومين `alphadev.store`.

## 1. إعدادات الـ DNS
يجب عليك التوجه إلى لوحة تحكم الدومين الخاص بك وإضافة السجلات التالية:

| النوع | الاسم | القيمة |
| :--- | :--- | :--- |
| A | @ | [عنوان IP الخاص بخادمك] |
| CNAME | www | alphadev.store |

## 2. إعدادات البيئة (.env)
قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع على الخادم وأضف القيم التالية:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your_secret_key
OAUTH_SERVER_URL=https://alphadev.store
VITE_APP_ID=your_app_id
```

## 3. التشغيل باستخدام Docker (موصى به)
لقد قمت بتجهيز ملف `Dockerfile` لتسهيل عملية التشغيل:

```bash
# بناء الصورة
docker build -t alpha-store .

# تشغيل الحاوية
docker run -d -p 3000:3000 --env-file .env --name alpha-app alpha-store
```

## 4. إعداد Nginx
لقد أرفقت ملف `nginx.conf` يمكنك استخدامه كقالب لإعداد Nginx على خادمك ليعمل كـ Reverse Proxy ويوجه الطلبات من الدومين إلى التطبيق.

## 5. شهادة SSL (HTTPS)
نوصي باستخدام Certbot للحصول على شهادة SSL مجانية:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d alphadev.store -d www.alphadev.store
```

---
**ملاحظة:** تأكد من تحديث `DATABASE_URL` و `JWT_SECRET` بقيم حقيقية وآمنة قبل التشغيل.
