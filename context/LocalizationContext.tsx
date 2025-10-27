import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

const it = {
  "header": {
    "subtitle": "Registro delle ore per il servizio di pioniere."
  },
  "nav": {
    "home": "Home",
    "progress": "Progresso",
    "history": "Cronologia",
    "settings": "Impostazioni"
  },
  "home": {
    "quickSummary": "Riepilogo Rapido",
    "currentMonthHours": "Ore Mese Corrente ({0})",
    "serviceYearHours": "Totale Ore Anno di Servizio"
  },
  "calendar": {
    "addHoursFor": "Aggiungi Ore per {0}",
    "hours": "Ore",
    "hoursPlaceholder": "es. 2.5",
    "cancel": "Annulla",
    "save": "Salva"
  },
  "progress": {
    "title": "Progresso Annuale",
    "goal": "Obiettivo: {0} ore",
    "hours": "ore",
    "completed": "% completato",
    "monthlyStatus": "Stato Mensile",
    "hoursRemaining": "Ore Mancanti",
    "monthlyAvgNeeded": "Media Mensile Necessaria"
  },
  "history": {
    "title": "Cronologia Anno di Servizio {0}",
    "hours": "Ore:",
    "share": "Condividi",
    "copied": "Copiato!",
    "shareText": "Rapporto di {0} {1}: {2} ore."
  },
  "settings": {
    "title": "Impostazioni",
    "appearance": "Aspetto",
    "darkTheme": "Tema Scuro",
    "dataManagement": "Gestione Dati",
    "createBackup": "Crea Backup",
    "importBackup": "Importa Backup",
    "clearData": "Cancella Tutti i Dati",
    "language": "Lingua",
    "importSuccess": "Dati importati con successo!",
    "importError": "Errore: Il file di backup non è valido.",
    "clearConfirm": "Sei sicuro di voler cancellare tutti i dati? Questa azione è irreversibile.",
    "clearSuccess": "Tutti i dati sono stati cancellati."
  },
  "months": {
    "full": "Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre"
  },
  "days": {
    "short": "Lun,Mar,Mer,Gio,Ven,Sab,Dom"
  }
};

const en = {
  "header": {
    "subtitle": "Hour log for pioneer service."
  },
  "nav": {
    "home": "Home",
    "progress": "Progress",
    "history": "History",
    "settings": "Settings"
  },
  "home": {
    "quickSummary": "Quick Summary",
    "currentMonthHours": "Current Month's Hours ({0})",
    "serviceYearHours": "Total Service Year Hours"
  },
  "calendar": {
    "addHoursFor": "Add Hours for {0}",
    "hours": "Hours",
    "hoursPlaceholder": "e.g. 2.5",
    "cancel": "Cancel",
    "save": "Save"
  },
  "progress": {
    "title": "Annual Progress",
    "goal": "Goal: {0} hours",
    "hours": "hours",
    "completed": "% completed",
    "monthlyStatus": "Monthly Status",
    "hoursRemaining": "Hours Remaining",
    "monthlyAvgNeeded": "Monthly Average Needed"
  },
  "history": {
    "title": "Service Year History {0}",
    "hours": "Hours:",
    "share": "Share",
    "copied": "Copied!",
    "shareText": "Report for {0} {1}: {2} hours."
  },
  "settings": {
    "title": "Settings",
    "appearance": "Appearance",
    "darkTheme": "Dark Theme",
    "dataManagement": "Data Management",
    "createBackup": "Create Backup",
    "importBackup": "Import Backup",
    "clearData": "Clear All Data",
    "language": "Language",
    "importSuccess": "Data imported successfully!",
    "importError": "Error: The backup file is not valid.",
    "clearConfirm": "Are you sure you want to delete all data? This action is irreversible.",
    "clearSuccess": "All data has been deleted."
  },
  "months": {
    "full": "January,February,March,April,May,June,July,August,September,October,November,December"
  },
  "days": {
    "short": "Mon,Tue,Wed,Thu,Fri,Sat,Sun"
  }
};


const translations: { [key: string]: any } = { it, en };

interface LocalizationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, ...args: any[]) => string;
  getLocalizedMonthNames: () => string[];
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && translations[savedLang]) return savedLang;
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'en'; // default to English
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = useCallback((key: string, ...args: any[]): string => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        let fallbackResult = translations['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }
        const fallbackText = fallbackResult || key;
        if (typeof fallbackText === 'string' && args.length > 0) {
           return fallbackText.replace(/{(\d+)}/g, (match, number) => {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        }
        return fallbackText;
      }
    }
    
    if (typeof result === 'string' && args.length > 0) {
        return result.replace(/{(\d+)}/g, (match, number) => {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    }
    return result || key;
  }, [language]);

  const getLocalizedMonthNames = useCallback(() => {
    return t('months.full').split(',');
  }, [t]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t, getLocalizedMonthNames }}>
      {children}
    </LocalizationContext.Provider>
  );
};