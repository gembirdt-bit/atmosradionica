# Atmos Radionica

**Atmos Radionica** je aplikacija za auto servis: radni nalozi sa statusima, baza vozila, mehaničari, delovi, podsetnici na redovne servise, predračun i račun za štampu. Radi na **Android** telefonima i tabletima i na **Windows** računarima, i bez interneta. Sama se ažurira.

Podaci se čuvaju na uređaju, a svi uređaji istog naloga se međusobno sinhronizuju.

## Mogućnosti

- **Radni nalozi** — statusi **Uzet u rad → U obradi → Završen**, plaćeno / za naplatu, dodela mehaničara, opis kvara, stavke (rad i delovi) sa količinom i cenom, popust, automatski brojevi (`N-2026-0001`), dogovoren rok isporuke, gorivo i stanje vozila pri prijemu
- **Štampa i PDF** — radni nalog, **predračun** i **račun** jednim klikom, sa **logom radionice** i poljima za **potpis mehaničara i mušterije**; A4 sa marginama; **Podeli PDF** u Viber, WhatsApp, e-poštu, Drive…
- **Obaveštenje klijentu** — kad je vozilo završeno, poruka na **Viber** / WhatsApp / SMS (tekst se podešava)
- **Delovi** — poručivanje: Poručiti → Poručeno → Stiglo → U radionici, sa količinom, dobavljačem i vozilom; deljenje liste za poručivanje
- **Mušterije** — imenik sa više vozila po mušteriji, kontaktom, istorijom i dugom (za naplatu)
- **NBS IPS QR** — QR kod za plaćanje m-bankingom na predračunu i računu
- **Baza vozila** — tablica, **VIN** (provera i prepoznavanje marke), marka, model, godina, kubikaža, snaga (kW / KS), gorivo, kilometraža, vlasnik, telefon, servisna istorija
- **Skeniranje saobraćajne dozvole kamerom** — automatski popunjava podatke o vozilu i vlasniku (uvek proveri pre čuvanja)
- **Mehaničari** — evidencija, dodela naloga, izveštaj po mehaničaru
- **Podsetnici na servis** — po datumu i/ili kilometraži, sa ponavljanjem; sledeći redovni servis se zakazuje sam; poruka klijentu jednim klikom
- **Izveštaji** — prihod po mesecu, godini, 3 i 6 meseci, po mehaničarima; grafikon; štampa / PDF; CSV izvoz
- **PDV** — opciono (20% / 10%), cene sa ili bez PDV-a
- **Garancija** — broj dana se štampa na računu
- **Sinhronizacija** — isti podaci na svim uređajima naloga (telefon, tablet, računar)
- **Rezervna kopija** — jednim dugmetom napravi ili vrati kopiju; automatske dnevne kopije na uređaju i upis u folder jednom dnevno (Windows); CSV za Excel
- **Automatsko ažuriranje** — nova verzija stiže sama, bez ponovne instalacije

## Instalacija

Preuzmi aplikaciju sa stranice **[Releases](../../releases/latest)**.

### Android

1. Preuzmi **`AtmosRadionica.apk`** na telefon.
2. Otvori preuzeti fajl. Ako telefon pita, dozvoli instalaciju iz ovog izvora.
3. Pokreni **Atmos Radionica** i prijavi se korisničkim imenom i PIN-om.

Potreban je Google Chrome (na većini telefona je već instaliran).

### Windows

1. Preuzmi **`AtmosRadionica-Setup.exe`** i pokreni ga. Za rad bez instalacije postoji **`AtmosRadionica-Portable.exe`**.
2. Ako se pojavi „Windows je zaštitio računar“, klikni **Više informacija → Ipak pokreni**.
3. Pokreni **Atmos Radionica** sa radne površine i prijavi se korisničkim imenom i PIN-om.

### Prvo pokretanje

- Prvo pokretanje traži internet, posle aplikacija radi i bez njega.
- U **Podešavanja → Podaci radionice** upiši naziv, adresu, PIB i tekući račun — prikazuju se na dokumentima.
- Ako prelaziš sa ranije verzije u pregledaču: tamo klikni **Izvezi podatke (JSON)**, pa u aplikaciji **Podešavanja → ⬆ Uvezi bazu**.

## Verzije

### 1.9.0
- Zaštita prijave: posle 5 pogrešnih PIN-ova nalog se zaključava na 15 minuta

### 1.8.5
- Podešavanja: rezervna kopija i sinhronizacija su jedna do druge, ažuriranje aplikacije je na dnu

### 1.8.4
- Jednostavnija rezervna kopija: dugmad **Napravi rezervnu kopiju** i **Vrati rezervnu kopiju** (iz fajla ili iz automatskih kopija na uređaju); CSV i brisanje podataka su pod „Napredno“

### 1.8.3
- Popravljeno zatvaranje tastature na telefonu pri dodiru polja

### 1.8.2
- Popravljen unos u Podešavanjima: tastatura se više ne zatvara i tekst se ne prekida tokom kucanja

### 1.8.1
- Izbor šifre plaćanja u IPS QR kodu (289, 189 ili 221); podrazumevano 289

### 1.8.0
- **Mušterije** — imenik: jedna mušterija sa više vozila, kontakt (poziv, Viber, WhatsApp, SMS), adresa i PIB za firme, istorija naloga, plaćeno i **za naplatu** po mušteriji. Postojeća vozila se sama povezuju sa mušterijama po imenu i telefonu vlasnika.
- **NBS IPS QR kod** na predračunu i neplaćenom računu — mušterija plaća skeniranjem u m-bankingu. Uključuje se u Podešavanja → Podaci radionice (potreban ispravan tekući račun).

### 1.7.1
- Backup u folder (Windows) upisuje se jednom dnevno
- Uklonjeno „Podeli kopiju“ — ostaju izvoz i uvoz baze

### 1.7.0
- **Sinhronizacija između uređaja** — svi uređaji istog naloga dele naloge, vozila, podsetnike, delove, mehaničare i podatke radionice. Izmene se šalju par sekundi posle čuvanja i na svakih 5 minuta; bez interneta sve radi, a izmene odlaze kad se veza vrati. Stanje i dugme **Sinhronizuj sada** su u Podešavanjima.

### 1.6.5
- Dugme Aktivacija menja boju: tamno dok je licenca aktivna, zeleno kad ističe, crveno kad je istekla
- U Podešavanjima kartica **Licenca**: korisnik, trajanje licence, maksimalni i prijavljeni broj uređaja

### 1.6.4
- Tehnička podrška je na dnu Podešavanja, u manjem obliku

### 1.6.3
- Popravljeno otvaranje Windows programa

### 1.6.2
- Bezbednija prijava

### 1.6.1
- Android aplikacija i Windows program

### 1.6.0
- **Podeli PDF** — nalog, predračun i račun kao PDF u bilo koju aplikaciju
- Štampa A4 sa marginama; štampa / PDF izveštaja
- Početni ekran: klik na „Uzeto u rad“, „U obradi“, „Završeno“, „Za naplatu“ otvara listu tih naloga
- Na nalogu: dogovoren rok isporuke (oznaka „kasni“), gorivo i stanje pri prijemu, broj dana u radionici, dugme **📞 Pozovi**
- Garancija na računu

### 1.5.0
- Popravljen mobilni prikaz
- Potpisi mehaničara i mušterije na dokumentima
- Obaveštenje klijentu preko Viber-a / WhatsApp-a / SMS-a
- Nova sekcija **Delovi**
- Mesečni i godišnji izveštaji
- Logo radionice na dokumentima

## Napomena o računima

Račun iz aplikacije nije fiskalni račun. Ako zakon za tvoju delatnost traži fiskalizaciju, fiskalni isečak ili e-faktura se izdaju posebno.

## Tehnička podrška

E-pošta: **vasserviserbgd@gmail.com**

## Autor

**Gemb-Bit Željko Ilić**
