USTAREHBER - İLK ÇALIŞAN ÖN YÜZ PROTOTİPİ
=============================================

DOSYALAR
- index.html : Sayfa yapısı
- style.css  : Tasarım ve mobil uyum
- app.js     : Araç seçimi ve temel etkileşimler

BİLGİ
Bu paket, UstaRehber'in görsel ve etkileşimli ön yüz prototipidir.
Araç seçimi, marka-model listesi, yıl alanı, arama alanı, rehber kartları,
belirti pencereleri ve mobil menü çalışır.

ÖNEMLİ SINIRLAR
- Henüz sunucu/veritabanı veya yönetim paneli yoktur.
- Araç katalogları örnek başlangıç listesidir; tam kapsamlı değildir.
- Teknik bakım aralıkları, yağ kapasitesi, tork değerleri ve parça uyumları
  bilerek kesin değer olarak eklenmemiştir.
- Arama alanı henüz gerçek içerik araması yapmaz.
- Bakım kartları ve yeni tamirat kütüphanesi genel ön değerlendirme açıklamaları sunar; üretici kaynaklı, araç özelinde tamir prosedürleri değildir.
- Tamirat bölümleri motor/turbo, şanzıman/debriyaj, fren/yürüyen aksam, elektrik/elektronik, soğutma ve yakıt/egzoz başlıklarını içerir.
- Fotoğraflar internet bağlantısı gerektiren Unsplash görselleridir.
- Yayın öncesi gerçek içerikler üretici kılavuzu/teknik doküman ve uygun ikinci
  kaynakla kontrol edilmeli; her makaleye kaynak, uyum ve kontrol tarihi eklenmelidir.

YEREL ÖNİZLEME
index.html dosyasını tarayıcıda açın. Fotoğraflar ve Google Fonts için internet gerekir.

GITHUB PAGES İLE YAYINLAMA
1. ZIP dosyasını telefonda veya bilgisayarda açın.
2. İçindeki index.html, style.css, app.js ve README.txt dosyalarını GitHub
   deposunun ana dizinine yükleyin.
3. GitHub deposunda Settings > Pages bölümüne girin.
4. Build and deployment altında Deploy from a branch seçin.
5. Branch: main, Folder: /(root) seçip Save'e basın.
6. GitHub Pages adresi oluşunca açıp telefonda test edin.

SONRAKİ GELİŞTİRME AŞAMASI
1. Gerçek araç/motor veri modeli
2. Kaynak belgeli bakım içerik yönetimi
3. Arama ve filtreleme
4. Yönetici paneli ve içerik doğrulama iş akışı
5. Kullanıcı üyeliği, favoriler ve araç garajı
6. SEO, erişilebilirlik, performans ve güvenlik testleri


ARAÇ/MOTOR AYRIŞTIRMA - V4
- Marka > model > model yılı > motor seçimi birbirine bağlı hale getirildi.
- Motor kodu için ayrı alan eklendi.
- Araç profili; bakım, tamirat, arıza belirtileri ve teknik bilgi başlıklarını ayırır.
- İçerik kataloğunda yalnızca örnek araç varyantları bulunur. Bu liste tam değildir.
- Motor kodu ve araç uyumu VIN/üretici belgesi ile teyit edilmeden kesin kabul edilmez.
- Henüz üretici tarafından doğrulanmış kapsamlı araç veritabanı veya araç başına tamir prosedürü yoktur.


ARAÇ ANA KATALOĞU - V5 VERİ PAKETİ
- data/vehicles.json: Türkiye pazarı için marka-model ana indeks dosyası.
- data/vehicle-model-index.csv: Araştırma ve doğrulama için doldurulabilir tablo.
- KAYNAKLAR_VE_VERI_NOTU.txt: Kaynaklar, kapsam ve veri sınırları.

Bu sürümde marka ve model adları başlangıç kataloğuna eklendi. Kasa nesli,
yıl, motor, motor kodu ve şanzıman alanları henüz toplu olarak doğrulanmadı.
Boş alanlar bilerek boş bırakılmıştır. Bu paket, eksiksiz araç veri tabanı
veya üretici onaylı teknik veri olarak değerlendirilmemelidir.


V6 / KATALOG DENETİMİ
- data/vehicles.json ve data/vehicle-model-index.csv kontrol edilip eşitlendi.
- KATALOG_KONTROL_RAPORU.txt dosyasında denetim özeti bulunur.
- Katalog 0.2.0 sürümüne çıkarıldı.
- Yeni model kayıtları doğrulama bekleyen aday kayıt olarak işaretlendi.
- Önemli: app.js şu anda vehicles.json dosyasını okumuyor; araç seçiciye bağlama
  işi henüz yapılmadı.

V7: Marka ve modeller data/vehicles.js üzerinden yüklenir. Marka seçildiğinde o markanın modelleri filtrelenir. Ayrıntılar V7_SISTEM_GUNCELLEMESI.txt dosyasındadır.


V8 FORD GENİŞLETİLMİŞ KATALOG
- Ford modellerinin nesil/yıl kayıtları vehicles.json içine eklendi.
- data/ford-generation-engine-index.csv: Ford nesil ve aday motor aileleri.
- Ford yıl seçimi artık nesil kayıtlarından otomatik oluşturulur.
- Motor aileleri doğrulama bekleyen adaydır; kesin Türkiye uyumluluğu değildir.
- FORD_KATALOG_ARASTIRMA_RAPORU.txt kapsam ve kaynak sınırlarını açıklar.

V9 ARIZA KODU MODULU
- Sayfada OBD-II ariza kodu sorgulama alani eklendi.
- data/dtc-library.json dosyasi app.js tarafindan yuklenir.
- Klasor yapisini koruyarak tum dosyalari birlikte yukleyin.
- Bu ilk surum genel kodlari icerir; model/motor ozel servis bultenleri sonraki arastirma partilerinde eklenmelidir.

V9 MODEL ARIZA ARASTIRMA PARTI 2
- Model/motor bazli ariza kutuphanesi 8 kayda genisletildi.
- Toyota Corolla E170, VW Golf Mk7, BMW 320d F30, Skoda Octavia 5E ve Mercedes A Serisi W176 eklendi.
- Genel DTC kutuphanesine P2002 eklendi.
- Kaynak ve veri sinirlari MODEL_ARIZA_ARASTIRMA_PARTI_2.txt dosyasindadir.

V9 MODEL ARIZA ARASTIRMA PARTI 3
- Opel Astra J, Peugeot 308 T7, Citroen C4 II, Hyundai i30 GD, Kia Ceed JD,
  Honda Civic FB, Nissan Qashqai J11, Mazda 3 BK, Volvo V40 D2, SEAT Leon 5F,
  Dacia Duster I icin model/motor ariza kayitlari eklendi.
- Model/motor ariza veritabani toplam 19 kayda genisletildi.
- Genel OBD-II DTC kutuphanesi 22 kayda genisletildi.
- Ayrintili kaynaklar ve veri sinirlari MODEL_ARIZA_ARASTIRMA_PARTI_3.txt dosyasindadir.

V9 SIK ARIZA VEREN ARACLAR MODULU
- Kaynaklarda tekrar eden 11 motor/sanziman kombinasyonu eklendi.
- Yeni bolum: Sık Arıza Verenler.
- Marka/model/motor arama ve risk başlığı filtresi bulunur.
- Veriler data/high-risk-vehicles.json dosyasindan yuklenir.
- Liste ariza orani siralamasi degildir; yontem ve kaynak sinirlari SIK_ARIZA_VEREN_ARACLAR_KAYNAK_NOTU.txt dosyasindadir.


V10 GELİŞTİRMESİ (02.11.2026)
- Sistem Arıza Rehberi eklendi: 14 genel teşhis kaydı; motor, yakıt-hava, soğutma, şanzıman, elektrik, elektronik, yürüyen aksam ve fren.
- Her kayıtta belirtiler, olası nedenler, teşhis sırası, onarım yaklaşımı ve güvenlik uyarısı bulunur.
- Bu kayıtlar model-özel kronik arıza iddiası değildir. Model/motor eşleştirmesi VIN ve üretici dokümanıyla ayrıca doğrulanmalıdır.
- Onarım maliyeti alanı veri modeline eklendi; güvenilir güncel parça/işçilik teklifi doğrulanmadığı için TL tutarı uydurulmadı.
- Araç kataloğunda 59 marka ve 429 model adı bulunur; kasa/motor kapsamı bütün markalarda tamamlanmış değildir. Ford için daha ayrıntılı nesil/motor aday kayıtları vardır.
- Yerel tarayıcı testi yapılmadı; JSON ve JavaScript sözdizimi ile ZIP bütünlüğü kontrol edilmiştir.


V11 GELİŞTİRMESİ (02.11.2026)
- Marka > model > kasa/nesil > motor seçimi zinciri eklendi.
- İlk kaynaklı motor zinciri partisi: Ford Focus Mk2 1.6 TDCi, Renault Clio IV 1.5 dCi, Fiat Egea 1.3 Multijet II, Toyota Corolla E170 1.4 D-4D, Volkswagen Golf VII 1.6 TDI.
- Motor aileleri ve aday motor kodları ayrı alanlarda tutulur; alt kod/VIN doğrulama notları gösterilir.
- Zincir kayıtları mevcut modele özel arıza kayıtlarına bağlandı; kullanıcı motoru seçince ilgili arızaları, belirtileri, kontrolleri, çözüm yaklaşımını ve kaynakları görebilir.
- Bu ilk parti bütün marka/model/kasa/motor seçeneklerinin tamamlandığı anlamına gelmez.


V12 GELİŞTİRMESİ (02.11.2026)
- Kaynaklı marka-model-kasa-motor zinciri 5 yeni aile ile genişletildi: Fiat Linea, Opel Astra J, Renault Megane III, Mercedes-Benz C Serisi W204, Nissan Qashqai J10.
- Model-özel arıza kayıtları eklendi: Linea 1.3 Multijet, Astra J 1.3 CDTI, Megane III 1.5 dCi EDC, W204 OM651, Qashqai J10 1.5 dCi.
- Toplam 10 araç ailesi zincir verisinde yer alıyor. Her motor seçeneği ve her kasa henüz tamamlanmış değildir.
- Arıza kayıtlarında belirtiler, kontrol adımları, çözüm yaklaşımı, uyarı ve kaynak bağlantıları yer alır.
- Motor kodları VIN ile doğrulanması gereken uygulama kodlarıdır; tahmini eşleştirme kesin uyumluluk değildir.
