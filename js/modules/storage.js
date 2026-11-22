/**
 * VeciAyuda — Módulo de Almacenamiento de Adjuntos (IndexedDB + Compresión)
 * Ilustre Municipalidad de Padre Las Casas
 * 
 * Evita la saturación del límite de 5MB de localStorage aislando los binarios y PDFs
 * en una base de datos IndexedDB en el cliente, manteniendo solo referencias ligeras en el estado.
 */

const DB_NAME = 'VeciAyuda_StorageDB';
const DB_VERSION = 1;
const STORE_NAME = 'attachments';

class StorageManager {
  constructor() {
    this.db = null;
    this.isReady = false;
    this.memoryFallback = new Map();
  }

  async init() {
    if (this.isReady && this.db) return this.db;
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('[VeciStorage] IndexedDB no soportado en este entorno. Usando memoria.');
      this.isReady = true;
      return null;
    }

    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('folio', 'folio', { unique: false });
          store.createIndex('fecha', 'fecha', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.isReady = true;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.warn('[VeciStorage] Error al abrir IndexedDB:', event.target.error);
        this.isReady = true;
        resolve(null);
      };
    });
  }

  /**
   * Compresión en cliente para imágenes (boletas, certificados en foto)
   * Reduce archivos de 4-5MB a <300KB sin pérdida de legibilidad de texto.
   */
  async compressImage(file, maxWidth = 1280, quality = 0.75) {
    if (!file || !file.type.startsWith('image/')) return file;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(blob || file);
          }, 'image/jpeg', quality);
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Guarda un archivo adjunto en IndexedDB
   */
  async saveAttachment({ folio, nombre, tipo, size, blob, base64 }) {
    await this.init();
    const id = `att_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const record = {
      id,
      folio: folio || 'GENERAL',
      nombre: nombre || 'documento.pdf',
      tipo: tipo || 'application/pdf',
      size: size || '0 KB',
      fecha: new Date().toISOString(),
      blob: blob || null,
      base64: base64 || null
    };

    if (!this.db) {
      this.memoryFallback.set(id, record);
      return record;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(record);

        req.onsuccess = () => resolve(record);
        req.onerror = (e) => {
          this.memoryFallback.set(id, record);
          resolve(record);
        };
      } catch (err) {
        this.memoryFallback.set(id, record);
        resolve(record);
      }
    });
  }

  /**
   * Obtiene un adjunto por su ID único
   */
  async getAttachment(id) {
    await this.init();
    if (this.memoryFallback.has(id)) return this.memoryFallback.get(id);
    if (!this.db) return null;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  /**
   * Obtiene la lista completa de adjuntos asociados a un folio de solicitud
   */
  async getAttachmentsByFolio(folio) {
    await this.init();
    const fromMemory = Array.from(this.memoryFallback.values()).filter(a => a.folio === folio);
    if (!this.db) return fromMemory;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('folio');
        const req = index.getAll(folio);

        req.onsuccess = () => {
          const results = req.result || [];
          resolve([...results, ...fromMemory]);
        };
        req.onerror = () => resolve(fromMemory);
      } catch (e) {
        resolve(fromMemory);
      }
    });
  }

  /**
   * Elimina un adjunto por ID
   */
  async deleteAttachment(id) {
    await this.init();
    this.memoryFallback.delete(id);
    if (!this.db) return true;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }
}

export const VeciStorage = new StorageManager();
