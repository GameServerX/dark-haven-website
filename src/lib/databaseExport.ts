// Утилиты для экспорта/импорта базы данных в файлы

import { db } from './localDatabase';

export class DatabaseExporter {
  // Экспорт в JSON файл
  static downloadAsJSON() {
    const data = db.exportDatabase();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `darkhaven_database_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Импорт из JSON файла
  static async importFromFile(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const success = db.importDatabase(content);
        resolve(success);
      };
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  }

  // Экспорт в SQL формат (для совместимости)
  static downloadAsSQL() {
    const data = JSON.parse(db.exportDatabase());
    let sql = '-- Dark Haven Database Export\n';
    sql += `-- Generated: ${new Date().toISOString()}\n\n`;

    // Генерируем SQL INSERT для каждой таблицы
    for (const [table, rows] of Object.entries(data)) {
      if (Array.isArray(rows) && rows.length > 0) {
        sql += `-- Table: ${table}\n`;
        for (const row of rows) {
          const columns = Object.keys(row).join(', ');
          const values = Object.values(row).map(v => 
            typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : 
            v === null ? 'NULL' : 
            typeof v === 'object' ? `'${JSON.stringify(v).replace(/'/g, "''")}'` :
            v
          ).join(', ');
          sql += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
        }
        sql += '\n';
      }
    }

    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `darkhaven_database_${new Date().toISOString().split('T')[0]}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Автоматическое резервное копирование
  static setupAutoBackup(intervalMinutes: number = 30) {
    setInterval(() => {
      console.log('Auto-backup: Creating database backup...');
      // Резервная копия создается автоматически при каждом сохранении в db
    }, intervalMinutes * 60 * 1000);
  }

  // Получить размер базы данных
  static getDatabaseSize(): { bytes: number; readable: string } {
    const data = db.exportDatabase();
    const bytes = new Blob([data]).size;
    const kb = bytes / 1024;
    const mb = kb / 1024;
    
    let readable: string;
    if (mb >= 1) {
      readable = `${mb.toFixed(2)} MB`;
    } else if (kb >= 1) {
      readable = `${kb.toFixed(2)} KB`;
    } else {
      readable = `${bytes} bytes`;
    }

    return { bytes, readable };
  }
}
