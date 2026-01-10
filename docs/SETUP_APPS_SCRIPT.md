# Apps Script Einrichtung - Schritt-für-Schritt Anleitung

Diese Anleitung führt Sie durch die komplette Einrichtung des Google Apps Scripts für die automatische Verarbeitung von Formularanmeldungen.

---

## Übersicht

Nach Abschluss dieser Anleitung wird das System automatisch:
- ✉️ **Bestätigungs-E-Mails** an Antragsteller senden
- 📧 **Benachrichtigungen** an den Admin senden
- 📎 **Jobcenter-PDF** anhängen (wenn ausgewählt)
- ✅ **IBAN validieren** (deutsches Format + Prüfsumme)
- 💾 **Wöchentliche Backups** erstellen (Sheet + JSON)

---

## Voraussetzungen

- [x] Google Forms Formular erstellt
- [x] Mit Google Sheets verknüpft
- [ ] Eingeloggt mit `info.zielev@gmail.com`

---

## Schritt 1: Apps Script öffnen

### 1.1 Google Sheets öffnen

1. Öffnen Sie [Google Drive](https://drive.google.com)
2. Suchen Sie Ihre Tabelle **"Anmeldungen_OGS_Ziel"** (oder wie Sie sie genannt haben)
3. Öffnen Sie die Tabelle mit Doppelklick

### 1.2 Apps Script Editor öffnen

1. In der Menüleiste klicken Sie auf **Erweiterungen**
2. Wählen Sie **Apps Script**

![Apps Script öffnen](../assets/screenshots/apps_script_menu.png)

> **Hinweis:** Es öffnet sich ein neuer Browser-Tab mit dem Apps Script Editor.

---

## Schritt 2: Script-Code einfügen

### 2.1 Vorhandenen Code löschen

Im Apps Script Editor sehen Sie standardmäßig:
```javascript
function myFunction() {
  
}
```

1. **Markieren Sie den gesamten Code** (Strg+A / Cmd+A)
2. **Löschen** Sie ihn (Entf / Backspace)

### 2.2 FormularAutomation.gs einfügen

1. Öffnen Sie die Datei `c:\DEVOPS\Ziel\scripts\FormularAutomation.gs`
2. **Kopieren Sie den gesamten Inhalt** (Strg+A, dann Strg+C)
3. **Fügen Sie ihn im Apps Script Editor ein** (Strg+V)

### 2.3 Projekt speichern

1. Klicken Sie auf das **Disketten-Symbol** (💾) oder drücken Sie **Strg+S**
2. Benennen Sie das Projekt: `Ziel_eV_Formular_Automation`

---

## Schritt 3: Konfiguration anpassen

### 3.1 CONFIG-Bereich finden

Scrollen Sie im Code nach oben. Ab **Zeile 24** finden Sie den Konfigurations-Block:

```javascript
const CONFIG = {
  // E-Mail-Adresse des Vereins (Absender und Admin-Empfänger)
  ADMIN_EMAIL: 'info.zielev@gmail.com',
  
  // Google Drive Ordner-ID für Backups
  BACKUP_FOLDER_ID: 'HIER_IHRE_ORDNER_ID_EINFUEGEN',
  
  // Google Drive Datei-ID des Jobcenter-PDFs
  JOBCENTER_PDF_ID: 'HIER_IHRE_PDF_ID_EINFUEGEN',
  
  // ... weitere Einstellungen
};
```

### 3.2 ADMIN_EMAIL prüfen

- Standardwert: `info.zielev@gmail.com`
- **Anpassen falls nötig** (wird für Admin-Benachrichtigungen verwendet)

### 3.3 BACKUP_FOLDER_ID einfügen

Dieser Ordner speichert die wöchentlichen Backups.

**Option A: Automatisch erstellen lassen**

1. Im Apps Script klicken Sie auf **▶ Ausführen**
2. Wählen Sie im Dropdown die Funktion: `initialSetup`
3. Klicken Sie erneut auf **▶ Ausführen**
4. **Berechtigungen erteilen** (siehe Schritt 4)
5. Schauen Sie in die **Ausführungsprotokolle** (Ansicht → Protokolle)
6. Dort steht: `Ordner-ID für CONFIG: XXXXXXXXXXXXX`
7. Kopieren Sie diese ID und ersetzen Sie `HIER_IHRE_ORDNER_ID_EINFUEGEN`

**Option B: Manuell erstellen**

1. Öffnen Sie [Google Drive](https://drive.google.com)
2. Klicken Sie auf **+ Neu → Ordner**
3. Nennen Sie ihn: `Ziel_eV_Anmeldungen_Archiv`
4. Öffnen Sie den Ordner
5. In der URL finden Sie: `https://drive.google.com/drive/folders/XXXXXXXXXXXXX`
6. Kopieren Sie den Teil nach `folders/` (das ist die Ordner-ID)
7. Ersetzen Sie `HIER_IHRE_ORDNER_ID_EINFUEGEN` mit dieser ID

### 3.4 JOBCENTER_PDF_ID einfügen

Diese PDF wird an Anträge mit Jobcenter-Förderung angehängt.

1. Öffnen Sie [Google Drive](https://drive.google.com)
2. Laden Sie die Datei `assets/Jobcenter_Platzhalter.pdf` hoch
   - Oder erstellen Sie Ihr eigenes Jobcenter-Formular
3. Klicken Sie mit **Rechtsklick** auf die Datei
4. Wählen Sie **Link abrufen** oder **Freigeben**
5. In der URL finden Sie: `https://drive.google.com/file/d/XXXXXXXXXXXXX/view`
6. Kopieren Sie den Teil zwischen `d/` und `/view` (das ist die Datei-ID)
7. Ersetzen Sie `HIER_IHRE_PDF_ID_EINFUEGEN` mit dieser ID

### 3.5 Konfiguration speichern

Speichern Sie das Projekt mit **Strg+S**.

> **Beispiel einer fertigen Konfiguration:**
> ```javascript
> const CONFIG = {
>   ADMIN_EMAIL: 'info.zielev@gmail.com',
>   BACKUP_FOLDER_ID: '1ABC2defGHI3jklMNO4pqrSTU5vwxYZ',
>   JOBCENTER_PDF_ID: '1XYZ2abcDEF3ghiJKL4mnoP5qrstuVW',
>   EMAIL_FIELD: 'E-Mail-Adresse',
>   JOBCENTER_FIELD: 'Jobcenter-Förderung',
>   IBAN_FIELD: 'IBAN',
>   CHILD_NAME_FIELD: 'Vorname des Kindes'
> };
> ```

---

## Schritt 4: Berechtigungen erteilen

Beim ersten Ausführen müssen Sie Google die Berechtigung für das Script geben.

### 4.1 Script ausführen

1. Wählen Sie im Dropdown die Funktion: `testEmailFunctions`
2. Klicken Sie auf **▶ Ausführen**

### 4.2 Berechtigungsdialog

1. Es erscheint: **"Berechtigung erforderlich"**
2. Klicken Sie auf **Berechtigungen prüfen**

### 4.3 Konto auswählen

1. Wählen Sie Ihr Google-Konto (`info.zielev@gmail.com`)

### 4.4 Sicherheitswarnung

> ⚠️ **Diese App wurde nicht von Google verifiziert**

1. Klicken Sie auf **Erweitert** (kleiner Link unten links)
2. Klicken Sie auf **Zu Ziel_eV_Formular_Automation (unsicher) wechseln**

### 4.5 Berechtigungen zulassen

Es werden folgende Berechtigungen angefragt:
- ✉️ E-Mails in Ihrem Namen senden
- 📊 Google Sheets-Datei ansehen und bearbeiten
- 📁 Google Drive-Dateien erstellen und ansehen

1. Klicken Sie auf **Zulassen**

> **Hinweis:** Diese Warnung erscheint, weil es ein selbst erstelltes Script ist. Es ist sicher!

---

## Schritt 5: Trigger einrichten

Trigger sorgen dafür, dass das Script automatisch ausgeführt wird.

### 5.1 Trigger-Seite öffnen

1. Im Apps Script klicken Sie links auf das **Uhr-Symbol** (⏰) → **Trigger**
2. Oder: Menü **Bearbeiten → Aktuelle Auslöser des Projekts**

### 5.2 Formular-Trigger erstellen (wichtigster Trigger!)

Dieser Trigger sendet E-Mails bei neuen Anmeldungen.

1. Klicken Sie auf **+ Trigger hinzufügen** (unten rechts)
2. Füllen Sie das Formular aus:

| Einstellung | Wert |
|-------------|------|
| **Funktion auswählen** | `onFormSubmit` |
| **Bereitstellung auswählen** | `Head` |
| **Ereignisquelle auswählen** | `Aus Tabellenkalkulation` |
| **Ereignistyp auswählen** | `Bei Formularübermittlung` |
| **Fehlerbenachrichtigungen** | `Sofort benachrichtigen` |

3. Klicken Sie auf **Speichern**

### 5.3 Backup-Trigger erstellen (optional, aber empfohlen)

Dieser Trigger erstellt wöchentliche Sicherungskopien.

1. Klicken Sie erneut auf **+ Trigger hinzufügen**
2. Füllen Sie das Formular aus:

| Einstellung | Wert |
|-------------|------|
| **Funktion auswählen** | `createWeeklyBackup` |
| **Bereitstellung auswählen** | `Head` |
| **Ereignisquelle auswählen** | `Zeitgesteuert` |
| **Art des zeitbasierten Auslösers** | `Wochentimer` |
| **Wochentag auswählen** | `Sonntag` |
| **Tageszeit auswählen** | `00:00 Uhr - 01:00 Uhr` |
| **Fehlerbenachrichtigungen** | `Täglich benachrichtigen` |

3. Klicken Sie auf **Speichern**

### 5.4 Trigger überprüfen

Sie sollten jetzt **2 Trigger** in der Liste sehen:
- `onFormSubmit` - Bei Formularübermittlung
- `createWeeklyBackup` - Jeden Sonntag Nacht

---

## Schritt 6: Test durchführen

### 6.1 E-Mail-Funktionen testen

1. Im Apps Script wählen Sie die Funktion: `testEmailFunctions`
2. Klicken Sie auf **▶ Ausführen**
3. Prüfen Sie Ihr E-Mail-Postfach (`info.zielev@gmail.com`)
4. Sie sollten **2 Test-E-Mails** erhalten:
   - Bestätigungs-E-Mail
   - Admin-Benachrichtigung

### 6.2 IBAN-Validierung testen

1. Wählen Sie die Funktion: `testIBANValidation`
2. Klicken Sie auf **▶ Ausführen**
3. Öffnen Sie **Ansicht → Protokolle** (oder Strg+Enter)
4. Sie sollten Test-Ergebnisse sehen:
   ```
   === IBAN Validierung Tests ===
   ✓ PASS: Gültige Test-IBAN
   ✓ PASS: Ohne Leerzeichen
   ✓ PASS: Ungültige Prüfsumme
   ✓ PASS: Französische IBAN
   ✓ PASS: Zu kurz
   ```

### 6.3 Formular-Integration testen

Der wichtigste Test! 

1. Öffnen Sie Ihr **Google Formular**
2. Klicken Sie auf **Vorschau** (Augen-Symbol oben rechts)
3. Füllen Sie das Formular mit **Testdaten** aus
4. Senden Sie das Formular ab
5. Prüfen Sie:
   - [ ] E-Mail an die eingegebene Testadresse erhalten?
   - [ ] Admin-Benachrichtigung an `info.zielev@gmail.com` erhalten?
   - [ ] Daten in Google Sheets eingetragen?

---

## Schritt 7: Fehlerüberwachung

### 7.1 Ausführungsprotokoll prüfen

Bei Problemen können Sie die Logs einsehen:

1. Im Apps Script klicken Sie links auf **Ausführungen** (▶ Symbol)
2. Hier sehen Sie alle bisherigen Script-Ausführungen
3. Klicken Sie auf einen Eintrag für Details

### 7.2 Typische Fehler und Lösungen

| Fehler | Lösung |
|--------|--------|
| "Berechtigung erforderlich" | Berechtigungen neu erteilen (Schritt 4) |
| "Ordner nicht gefunden" | BACKUP_FOLDER_ID in CONFIG prüfen |
| "PDF nicht gefunden" | JOBCENTER_PDF_ID in CONFIG prüfen |
| "E-Mail konnte nicht gesendet werden" | Tägliches E-Mail-Limit erreicht (100/Tag) |

---

## Zusammenfassung der erledigten Schritte

Nach Abschluss dieser Anleitung haben Sie:

- [x] Apps Script Code eingefügt
- [x] Konfiguration angepasst (Ordner-ID, PDF-ID)
- [x] Berechtigungen erteilt
- [x] Trigger für Formular-Übermittlung erstellt
- [x] Trigger für wöchentliche Backups erstellt
- [x] Alle Funktionen getestet

---

## Nächste Schritte

Nach erfolgreicher Einrichtung können Sie fortfahren mit:

1. **Jimdo-Integration** - Formular auf der Website einbetten
   → Siehe `docs/JIMDO_INTEGRATION.md`

2. **Testlauf mit Echtdaten** - Formular mit echten Anmeldungen nutzen

3. **Monitoring** - Regelmäßig Ausführungsprotokolle prüfen

---

## Support

Bei Problemen:
1. Prüfen Sie die [Google Apps Script Dokumentation](https://developers.google.com/apps-script)
2. Schauen Sie in die Ausführungsprotokolle
3. Kontaktieren Sie den technischen Ansprechpartner

---

**Erstellt:** Januar 2026  
**Version:** 1.0  
**Autor:** Ziel e.V. Entwicklungsteam
