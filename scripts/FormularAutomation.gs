/**
 * ============================================================
 * Ziel e.V. - Online-Anmelde-System
 * Google Apps Script für Formular-Automatisierung
 * ============================================================
 * 
 * Funktionen:
 * - Bestätigungs-E-Mail an Antragsteller
 * - Benachrichtigungs-E-Mail an Admin
 * - IBAN-Validierung (deutsches Format + Prüfsumme)
 * - Wöchentliche Backups (Sheet + JSON)
 * - PDF-Anhang bei Jobcenter-Förderung
 * 
 * Einrichtung:
 * 1. Diesen Code in Apps Script (Erweiterungen → Apps Script) einfügen
 * 2. CONFIG-Werte anpassen
 * 3. Trigger für onFormSubmit und createWeeklyBackup einrichten
 */

// ============================================================
// KONFIGURATION - BITTE ANPASSEN
// ============================================================

const CONFIG = {
  // E-Mail-Adresse des Vereins (Absender und Admin-Empfänger)
  ADMIN_EMAIL: 'info.zielev@gmail.com',
  
  // Google Drive Ordner-ID für Backups
  // So finden Sie die ID: Ordner öffnen → URL enthält "folders/XXXXX" → XXXXX kopieren
  BACKUP_FOLDER_ID: 'HIER_IHRE_ORDNER_ID_EINFUEGEN',
  
  // Google Drive Datei-ID des Jobcenter-PDFs
  // So finden Sie die ID: Datei → Freigeben → Link kopieren → ID ist zwischen "d/" und "/view"
  JOBCENTER_PDF_ID: 'HIER_IHRE_PDF_ID_EINFUEGEN',
  
  // Name des Formularfelds für E-Mail-Adresse (exakt wie im Formular)
  EMAIL_FIELD: 'E-Mail-Adresse',
  
  // Name des Formularfelds für Jobcenter-Förderung
  JOBCENTER_FIELD: 'Jobcenter-Förderung',
  
  // Name des Formularfelds für IBAN
  IBAN_FIELD: 'IBAN',
  
  // Name des Formularfelds für Kindname (für E-Mail-Personalisierung)
  CHILD_NAME_FIELD: 'Vorname des Kindes'
};

// ============================================================
// E-MAIL VORLAGEN
// ============================================================

const EMAIL_TEMPLATES = {
  // Bestätigungs-E-Mail an Antragsteller
  CONFIRMATION: {
    subject: 'Bestätigung Ihrer Anmeldung - OGS Ziel e.V.',
    body: `Sehr geehrte Damen und Herren,

hiermit bestätigen wir den Erhalt Ihrer Anfrage auf einen Platz bei der OGS Ziel e.V.

Es folgt zum späteren Zeitpunkt eine E-Mail mit der Zu- oder Absage.

Freundliche Grüße

Das Team vom Ziel e.V.

---
Dies ist eine automatisch generierte E-Mail. Bitte antworten Sie nicht direkt auf diese Nachricht.`
  },
  
  // Benachrichtigung an Admin
  NOTIFICATION: {
    subject: 'Neue Anmeldung eingegangen - OGS Ziel e.V.',
    bodyTemplate: (childName, timestamp) => `Neue Anmeldung eingegangen!

Zeitpunkt: ${timestamp}
Kind: ${childName}

Bitte prüfen Sie die Anmeldung in der Google Sheets Tabelle.

---
Automatische Benachrichtigung vom Anmeldesystem`
  }
};

/**
 * ============================================================
 * HAUPTFUNKTION: Bei POST-Anfragen (Von der Webseite)
 * ============================================================
 * Diese Funktion macht das System unabhängig von Google Forms.
 * Sie empfängt Daten direkt vom HTML-Formular auf der Webseite.
 */

function doPost(e) {
  try {
    const data = e.parameter;
    const timestamp = new Date().toLocaleString('de-DE');
    
    // 1. In Tabelle speichern
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetName = data.child_firstname ? "Anmeldungen" : "Interessentenliste";
    let sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      // Header setzen
      const headers = data.child_firstname ? 
        ["Zeitpunkt", "Kind Vorname", "Kind Nachname", "Geburtsdatum", "Nationalität", "Adresse", "PLZ", "Ort", "Klasse", "Lehrer", "Eltern1 Vorname", "Eltern1 Nachname", "Telefon", "E-Mail", "Eltern2 Vorname", "Eltern2 Nachname", "SEPA Inhaber", "IBAN", "Jobcenter"] :
        ["Zeitpunkt", "Vorname", "E-Mail"];
      sheet.appendRow(headers);
    }
    
    // Zeile vorbereiten
    let rowData;
    if (data.child_firstname) {
      rowData = [
        timestamp, data.child_firstname, data.child_lastname, data.child_birthday, data.child_nationality,
        data.address, data.zip, data.city, data.school_class, data.teacher,
        data.parent1_firstname, data.parent1_lastname, data.parent1_phone, data.email,
        data.parent2_firstname, data.parent2_lastname,
        data.bank_owner, data.iban, data.jobcenter ? "Ja" : "Nein"
      ];
    } else {
      rowData = [timestamp, data.vorname, data.email];
    }
    
    sheet.appendRow(rowData);

    // 2. E-Mails versenden
    if (data.child_firstname) {
      // Anmeldung
      sendConfirmationEmail(data.email, data.child_firstname, data.jobcenter === 'on');
      sendNotificationEmail(data.child_firstname + " " + data.child_lastname, timestamp, data);
    } else {
      // Newsletter
      MailApp.sendEmail(data.email, "Willkommen beim Ziel e.V.", "Vielen Dank für Ihr Interesse! Wir melden uns bei Neuigkeiten.");
    }

    // Antwort an Webbrowser
    return ContentService.createTextOutput("Erfolgreich").setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    logError('POST-Verarbeitung fehlgeschlagen', error.message);
    return ContentService.createTextOutput("Fehler: " + error.message).setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * BESTEHENDE FUNKTION: Bei Google Formularübermittlung
 * (Bleibt als Backup erhalten, falls Google Forms zusätzlich genutzt wird)
 */
function onFormSubmit(e) {
  try {
    const responses = e.namedValues;
    const timestamp = new Date().toLocaleString('de-DE');
    
    const applicantEmail = responses[CONFIG.EMAIL_FIELD] ? responses[CONFIG.EMAIL_FIELD][0] : null;
    const childName = responses[CONFIG.CHILD_NAME_FIELD] ? responses[CONFIG.CHILD_NAME_FIELD][0] : 'Nicht angegeben';
    const jobcenterSelected = responses[CONFIG.JOBCENTER_FIELD] ? 
                              responses[CONFIG.JOBCENTER_FIELD][0].toLowerCase().includes('ja') : false;
    
    if (applicantEmail) {
      sendConfirmationEmail(applicantEmail, childName, jobcenterSelected);
    }
    sendNotificationEmail(childName, timestamp, responses);
    
  } catch (error) {
    logError('Fehler bei Google Forms Integration', error.message);
  }
}

// ============================================================
// E-MAIL FUNKTIONEN
// ============================================================

function sendConfirmationEmail(recipientEmail, childName, attachJobcenterPdf) {
  try {
    let options = {
      name: 'Ziel e.V.',
      replyTo: CONFIG.ADMIN_EMAIL
    };
    
    if (attachJobcenterPdf && CONFIG.JOBCENTER_PDF_ID !== 'HIER_IHRE_PDF_ID_EINFUEGEN') {
      try {
        const pdfFile = DriveApp.getFileById(CONFIG.JOBCENTER_PDF_ID);
        options.attachments = [pdfFile.getAs(MimeType.PDF)];
      } catch (e) { logError('PDF-Anhang Fehler', e.message); }
    }
    
    MailApp.sendEmail(
      recipientEmail,
      EMAIL_TEMPLATES.CONFIRMATION.subject,
      EMAIL_TEMPLATES.CONFIRMATION.body,
      options
    );
  } catch (error) { logError('E-Mail Fehler', error.message); }
}

function sendNotificationEmail(childName, timestamp, data) {
  try {
    const body = `Neue Anmeldung über die Webseite eingegangen!\n\nZeitpunkt: ${timestamp}\nKind: ${childName}\nE-Mail: ${data.email || 'N/A'}\n\nDetails siehe Google Sheets.`;
    MailApp.sendEmail(CONFIG.ADMIN_EMAIL, 'Neue Webseite-Anmeldung - OGS Ziel e.V.', body);
  } catch (error) { logError('Admin-E-Mail Fehler', error.message); }
}

// ============================================================
// IBAN-VALIDIERUNG & BACKUPS (Unverändert)
// ============================================================

function validateIBAN(iban) {
  if (!iban) return false;
  iban = iban.replace(/[\s-]/g, '').toUpperCase();
  const germanIbanRegex = /^DE[0-9]{20}$/;
  if (!germanIbanRegex.test(iban)) return false;
  
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let numericString = '';
  for (let char of rearranged) {
    numericString += (char >= 'A' && char <= 'Z') ? (char.charCodeAt(0) - 55).toString() : char;
  }
  
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
  }
  return remainder === 1;
}

function createWeeklyBackup() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const today = new Date();
    const dateString = Utilities.formatDate(today, 'Europe/Berlin', 'yyyy-MM-dd');
    const backupFolder = CONFIG.BACKUP_FOLDER_ID === 'HIER_IHRE_ORDNER_ID_EINFUEGEN' ? 
                         DriveApp.getRootFolder() : DriveApp.getFolderById(CONFIG.BACKUP_FOLDER_ID);
    
    const spreadsheetCopy = spreadsheet.copy(`Anmeldungen_Backup_${dateString}`);
    const copyFile = DriveApp.getFileById(spreadsheetCopy.getId());
    backupFolder.addFile(copyFile);
    DriveApp.getRootFolder().removeFile(copyFile);
  } catch (error) { logError('Backup Fehler', error.message); }
}

function logError(context, message) {
  console.error(`[${new Date().toLocaleString('de-DE')}] ${context}: ${message}`);
}

function initialSetup() {
  const folder = DriveApp.createFolder('Ziel_eV_Anmeldungen_Archiv');
  console.log('Setup abgeschlossen. Ordner-ID für CONFIG: ' + folder.getId());
}
