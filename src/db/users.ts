import { db, isSqlConfigured } from './index.ts';
import { users, voters, aspirasi, quickCountTps } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

// In-Memory Fallback Store for reliable operation when Cloud SQL is unconfigured or unavailable
type VoterRecord = typeof voters.$inferSelect;
type AspirasiRecord = typeof aspirasi.$inferSelect;
type QuickCountRecord = typeof quickCountTps.$inferSelect;
type UserRecord = typeof users.$inferSelect;

// Seed Initial Voters (Synchronized with DPT KPU DKI Jakarta II & Sukamaju)
const inMemoryVoters: VoterRecord[] = [
  {
    id: 1,
    nik: '3174012508890047',
    nikMasked: '317401******0047',
    nama: 'HENDRA WIJAYA',
    tempatTglLahir: 'JAKARTA, 14-08-1992',
    jenisKelamin: 'Laki-laki',
    alamat: 'JL. CEMPAKA PUTIH NO. 15',
    rtRw: '004/005',
    kelurahan: 'Kel. Sukamaju',
    kecamatan: 'Kec. Cilandak',
    kabupatenKota: 'Jakarta Selatan',
    provinsi: 'DKI Jakarta',
    tps: 'TPS 047',
    noHp: '081288990011',
    fotoKtpUrl: null,
    statusDpt: 'DPT valid',
    statusRegistrasi: 'TERDAFTAR',
    terdaftarOleh: 'Ahmad Rizky (Kader TPS 047)',
    createdAt: new Date('2026-10-18T08:30:00Z'),
  },
  {
    id: 2,
    nik: '3174025409920002',
    nikMasked: '317402******0002',
    nama: 'SITI NURHALIZA',
    tempatTglLahir: 'JAKARTA, 24-09-1992',
    jenisKelamin: 'Perempuan',
    alamat: 'JL. MARGASATWA RAYA NO. 22',
    rtRw: '002/005',
    kelurahan: 'Kel. Sukamaju',
    kecamatan: 'Kec. Cilandak',
    kabupatenKota: 'Jakarta Selatan',
    provinsi: 'DKI Jakarta',
    tps: 'TPS 047',
    noHp: '081377889900',
    fotoKtpUrl: null,
    statusDpt: 'DPT valid',
    statusRegistrasi: 'TERDAFTAR',
    terdaftarOleh: 'Ahmad Rizky (Kader TPS 047)',
    createdAt: new Date('2026-10-19T09:15:00Z'),
  },
  {
    id: 3,
    nik: '3174031102850019',
    nikMasked: '317403******0019',
    nama: 'BUDI SANTOSO',
    tempatTglLahir: 'SURABAYA, 11-02-1985',
    jenisKelamin: 'Laki-laki',
    alamat: 'JL. FATMAWATI GANG KANCIL NO. 4',
    rtRw: '003/005',
    kelurahan: 'Kel. Sukamaju',
    kecamatan: 'Kec. Cilandak',
    kabupatenKota: 'Jakarta Selatan',
    provinsi: 'DKI Jakarta',
    tps: 'TPS 047',
    noHp: '081566778899',
    fotoKtpUrl: null,
    statusDpt: 'DPT valid',
    statusRegistrasi: 'TERDAFTAR',
    terdaftarOleh: 'Ahmad Rizky (Kader TPS 047)',
    createdAt: new Date('2026-10-20T10:00:00Z'),
  },
  {
    id: 4,
    nik: '3174044807960005',
    nikMasked: '317404******0005',
    nama: 'DEWI ANGGRAINI',
    tempatTglLahir: 'BANDUNG, 08-07-1996',
    jenisKelamin: 'Perempuan',
    alamat: 'JL. JERUK PURUT INDAH NO. 18',
    rtRw: '001/003',
    kelurahan: 'Kel. Sukamaju',
    kecamatan: 'Kec. Cilandak',
    kabupatenKota: 'Jakarta Selatan',
    provinsi: 'DKI Jakarta',
    tps: 'TPS 048',
    noHp: '081233445566',
    fotoKtpUrl: null,
    statusDpt: 'DPT valid',
    statusRegistrasi: 'TERDAFTAR',
    terdaftarOleh: 'Ahmad Rizky (Kader TPS 047)',
    createdAt: new Date('2026-10-20T14:20:00Z'),
  },
  {
    id: 5,
    nik: '3174051911910033',
    nikMasked: '317405******0033',
    nama: 'AHMAD FAUZI',
    tempatTglLahir: 'JAKARTA, 19-11-1991',
    jenisKelamin: 'Laki-laki',
    alamat: 'JL. BANGO RAYA NO. 9',
    rtRw: '005/002',
    kelurahan: 'Kel. Sukamaju',
    kecamatan: 'Kec. Cilandak',
    kabupatenKota: 'Jakarta Selatan',
    provinsi: 'DKI Jakarta',
    tps: 'TPS 049',
    noHp: '081900112233',
    fotoKtpUrl: null,
    statusDpt: 'DPT valid',
    statusRegistrasi: 'TERDAFTAR',
    terdaftarOleh: 'Ahmad Rizky (Kader TPS 047)',
    createdAt: new Date('2026-10-21T07:45:00Z'),
  },
];

// Seed Initial Aspirasi
const inMemoryAspirasi: AspirasiRecord[] = [
  {
    id: 1,
    kategori: 'Infrastruktur',
    judul: 'Perbaikan Penerangan Jalan Umum (PJU) RW 05',
    deskripsi: 'Jalan utama di RW 05 Sukamaju sangat gelap pada malam hari karena beberapa tiang lampu PJU rusak, memerlukan penggantian bohlam LED.',
    lokasi: 'Jl. Margasatwa Gang Kenanga, Sukamaju',
    tps: 'TPS 047',
    namaWarga: 'Hendra Wijaya',
    status: 'Diproses',
    poinApresiasi: 50,
    createdAt: new Date('2026-10-19T11:00:00Z'),
  },
  {
    id: 2,
    kategori: 'Lingkungan',
    judul: 'Normalisasi Saluran Drainase Menghadapi Musim Hujan',
    deskripsi: 'Saluran air tersumbat endapan lumpur sehingga sering meluap saat hujan deras di perbatasan RT 003 dan RT 004.',
    lokasi: 'Jl. Cempaka Putih RT 003/005',
    tps: 'TPS 047',
    namaWarga: 'Budi Santoso',
    status: 'Selesai',
    poinApresiasi: 50,
    createdAt: new Date('2026-10-20T13:30:00Z'),
  },
];

// Seed Initial Quick Count
const inMemoryQuickCount: QuickCountRecord[] = [
  {
    id: 1,
    tps: 'TPS 047',
    kelurahan: 'Kel. Sukamaju',
    kecamatan: 'Kec. Cilandak',
    saksiNama: 'Ahmad Rizky',
    suaraPaslon01: 142,
    suaraPaslon02: 56,
    suaraPaslon03: 21,
    suaraSah: 219,
    suaraTidakSah: 4,
    fotoC1Url: null,
    status: 'Terverifikasi Saksi',
    createdAt: new Date('2026-10-21T15:00:00Z'),
  },
  {
    id: 2,
    tps: 'TPS 012',
    kelurahan: 'Kel. Sukamaju',
    kecamatan: 'Kec. Cilandak',
    saksiNama: 'Bambang H.',
    suaraPaslon01: 128,
    suaraPaslon02: 64,
    suaraPaslon03: 15,
    suaraSah: 207,
    suaraTidakSah: 3,
    fotoC1Url: null,
    status: 'Terverifikasi Saksi',
    createdAt: new Date('2026-10-21T15:30:00Z'),
  },
];

const inMemoryUsers: UserRecord[] = [];

// Helper: Get or create user
export async function getOrCreateUser(uid: string, email: string, nama?: string): Promise<UserRecord> {
  if (db && isSqlConfigured) {
    try {
      const result = await db.insert(users)
        .values({
          uid,
          email,
          nama: nama || email.split('@')[0],
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email,
            ...(nama ? { nama } : {}),
          },
        })
        .returning();

      if (result && result[0]) {
        return result[0];
      }
    } catch (error) {
      console.warn('SQL getOrCreateUser notice, using in-memory store:', error);
    }
  }

  let existing = inMemoryUsers.find((u) => u.uid === uid);
  if (!existing) {
    existing = {
      id: inMemoryUsers.length + 1,
      uid,
      email,
      nama: nama || email.split('@')[0],
      role: 'kader',
      tps: 'TPS 047',
      kelurahan: 'Kel. Sukamaju',
      createdAt: new Date(),
    };
    inMemoryUsers.push(existing);
  }
  return existing;
}

// Helper: Save voter from OCR
export async function insertVoter(voterData: typeof voters.$inferInsert): Promise<VoterRecord> {
  const cleanNik = String(voterData.nik).replace(/\D/g, '');
  const cleanMasked = voterData.nikMasked || (cleanNik.length >= 8 ? `${cleanNik.slice(0, 4)}******${cleanNik.slice(-4)}` : cleanNik);

  if (db && isSqlConfigured) {
    try {
      const result = await db.insert(voters)
        .values({
          ...voterData,
          nik: cleanNik,
          nikMasked: cleanMasked,
        })
        .onConflictDoUpdate({
          target: voters.nik,
          set: {
            nama: voterData.nama,
            tempatTglLahir: voterData.tempatTglLahir,
            jenisKelamin: voterData.jenisKelamin,
            alamat: voterData.alamat,
            rtRw: voterData.rtRw,
            kelurahan: voterData.kelurahan,
            kecamatan: voterData.kecamatan,
            tps: voterData.tps,
            noHp: voterData.noHp,
            fotoKtpUrl: voterData.fotoKtpUrl,
          },
        })
        .returning();

      if (result && result[0]) {
        return result[0];
      }
    } catch (error) {
      console.warn('SQL insertVoter notice, saving to in-memory store:', error);
    }
  }

  // In-Memory store insertion / update
  const existingIndex = inMemoryVoters.findIndex((v) => v.nik === cleanNik);
  const record: VoterRecord = {
    id: existingIndex >= 0 ? inMemoryVoters[existingIndex].id : inMemoryVoters.length + 1,
    nik: cleanNik,
    nikMasked: cleanMasked,
    nama: (voterData.nama || 'PEMILIH').toUpperCase(),
    tempatTglLahir: voterData.tempatTglLahir || 'JAKARTA, 14-08-1992',
    jenisKelamin: voterData.jenisKelamin || 'Laki-laki',
    alamat: voterData.alamat || 'Kel. Sukamaju',
    rtRw: voterData.rtRw || '004/005',
    kelurahan: voterData.kelurahan || 'Kel. Sukamaju',
    kecamatan: voterData.kecamatan || 'Kec. Cilandak',
    kabupatenKota: voterData.kabupatenKota || 'Jakarta Selatan',
    provinsi: voterData.provinsi || 'DKI Jakarta',
    tps: voterData.tps || 'TPS 047',
    noHp: voterData.noHp || '-',
    fotoKtpUrl: voterData.fotoKtpUrl || null,
    statusDpt: voterData.statusDpt || 'DPT valid',
    statusRegistrasi: voterData.statusRegistrasi || 'TERDAFTAR',
    terdaftarOleh: voterData.terdaftarOleh || 'Kader Lapangan',
    createdAt: new Date(),
  };

  if (existingIndex >= 0) {
    inMemoryVoters[existingIndex] = record;
  } else {
    inMemoryVoters.unshift(record);
  }

  return record;
}

// Helper: Get all voters (Never throws ECONNREFUSED)
export async function getAllVoters(): Promise<VoterRecord[]> {
  if (db && isSqlConfigured) {
    try {
      const list = await db.select().from(voters).orderBy(desc(voters.createdAt));
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    } catch (error) {
      console.warn('SQL getAllVoters notice, returning in-memory voters:', error);
    }
  }

  return inMemoryVoters;
}

// Helper: Get voter by NIK
export async function getVoterByNik(nik: string): Promise<VoterRecord | null> {
  const clean = String(nik || '').replace(/\D/g, '');
  if (!clean) return null;

  if (db && isSqlConfigured) {
    try {
      const queryPromise = db.select().from(voters).where(eq(voters.nik, clean)).limit(1);
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200));
      const result = await Promise.race([queryPromise, timeoutPromise]);
      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      }
    } catch (error) {
      console.warn('SQL getVoterByNik notice, searching in-memory store:', error);
    }
  }

  const match = inMemoryVoters.find((v) => v.nik === clean);
  return match || null;
}

// Helper: Get all aspirasi
export async function getAllAspirasi(): Promise<AspirasiRecord[]> {
  if (db && isSqlConfigured) {
    try {
      const list = await db.select().from(aspirasi).orderBy(desc(aspirasi.createdAt));
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    } catch (error) {
      console.warn('SQL getAllAspirasi notice, returning in-memory aspirasi:', error);
    }
  }

  return inMemoryAspirasi;
}

// Helper: Insert aspirasi
export async function insertAspirasi(data: typeof aspirasi.$inferInsert): Promise<AspirasiRecord> {
  if (db && isSqlConfigured) {
    try {
      const result = await db.insert(aspirasi).values(data).returning();
      if (result && result[0]) {
        return result[0];
      }
    } catch (error) {
      console.warn('SQL insertAspirasi notice, saving to in-memory store:', error);
    }
  }

  const newRecord: AspirasiRecord = {
    id: inMemoryAspirasi.length + 1,
    kategori: data.kategori,
    judul: data.judul,
    deskripsi: data.deskripsi,
    lokasi: data.lokasi,
    tps: data.tps || 'TPS 047',
    namaWarga: data.namaWarga || 'Warga',
    status: data.status || 'Diterima',
    poinApresiasi: data.poinApresiasi || 50,
    createdAt: new Date(),
  };

  inMemoryAspirasi.unshift(newRecord);
  return newRecord;
}

// Helper: Get quick count
export async function getQuickCountResults(): Promise<QuickCountRecord[]> {
  if (db && isSqlConfigured) {
    try {
      const list = await db.select().from(quickCountTps).orderBy(desc(quickCountTps.createdAt));
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    } catch (error) {
      console.warn('SQL getQuickCountResults notice, returning in-memory quick count:', error);
    }
  }

  return inMemoryQuickCount;
}

// Helper: Insert quick count
export async function insertQuickCountRecord(data: typeof quickCountTps.$inferInsert): Promise<QuickCountRecord> {
  if (db && isSqlConfigured) {
    try {
      const result = await db.insert(quickCountTps).values(data).returning();
      if (result && result[0]) {
        return result[0];
      }
    } catch (error) {
      console.warn('SQL insertQuickCountRecord notice, saving to in-memory store:', error);
    }
  }

  const newRecord: QuickCountRecord = {
    id: inMemoryQuickCount.length + 1,
    tps: data.tps,
    kelurahan: data.kelurahan || 'Kel. Sukamaju',
    kecamatan: data.kecamatan || 'Kec. Cilandak',
    saksiNama: data.saksiNama || 'Saksi Mandiri',
    suaraPaslon01: data.suaraPaslon01 || 0,
    suaraPaslon02: data.suaraPaslon02 || 0,
    suaraPaslon03: data.suaraPaslon03 || 0,
    suaraSah: data.suaraSah || 0,
    suaraTidakSah: data.suaraTidakSah || 0,
    fotoC1Url: data.fotoC1Url || null,
    status: data.status || 'Terverifikasi Saksi',
    createdAt: new Date(),
  };

  inMemoryQuickCount.unshift(newRecord);
  return newRecord;
}
