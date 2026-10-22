export interface TpsPetaRecord {
  nomorTps: string;
  namaTps: string;
  lokasiAlamat: string;
  totalDpt: number;
  jumlahPendukung: number;
  persentasePenetrasi: number;
  sudahAdaPendukung: boolean;
  namaKoordinatorTps?: string;
  noHpKoordinator?: string;
  statusLogistik: 'Siap' | 'Kurang' | 'Belum Terdistribusi';
}

export interface KelurahanPetaRecord {
  id: string;
  nama: string;
  kodePos: string;
  totalTps: number;
  tpsSudahAdaPendukung: number;
  totalDpt: number;
  totalPendukung: number;
  persentasePenetrasi: number;
  sudahAdaPendukung: boolean;
  namaKorkel?: string;
  noHpKorkel?: string;
  tpsList: TpsPetaRecord[];
}

export interface KecamatanPetaRecord {
  id: string;
  nama: string;
  kabupatenKota: string;
  totalKelurahan: number;
  kelurahanSudahAdaPendukung: number;
  totalTps: number;
  tpsSudahAdaPendukung: number;
  totalDpt: number;
  totalPendukung: number;
  persentasePenetrasi: number;
  sudahAdaPendukung: boolean;
  namaKorcam?: string;
  noHpKorcam?: string;
  kelurahanList: KelurahanPetaRecord[];
}

export interface KabupatenPetaRecord {
  id: string;
  nama: string;
  dapil: string;
  totalKecamatan: number;
  kecamatanSudahAdaPendukung: number;
  totalKelurahan: number;
  kelurahanSudahAdaPendukung: number;
  totalTps: number;
  tpsSudahAdaPendukung: number;
  totalDpt: number;
  totalPendukung: number;
  persentasePenetrasi: number;
  sudahAdaPendukung: boolean;
  kecamatanList: KecamatanPetaRecord[];
}

// Data Struktur Pemetaan Suara Dapil Terpadu
export const INITIAL_PETA_SUARA_DATA: KabupatenPetaRecord[] = [
  {
    "id": "kab-jaksel",
    "nama": "Kota Jakarta Selatan",
    "dapil": "DAPIL DKI JAKARTA II",
    "totalKecamatan": 10,
    "kecamatanSudahAdaPendukung": 0,
    "totalKelurahan": 65,
    "kelurahanSudahAdaPendukung": 0,
    "totalTps": 3420,
    "tpsSudahAdaPendukung": 0,
    "totalDpt": 890450,
    "totalPendukung": 0,
    "persentasePenetrasi": 0,
    "sudahAdaPendukung": false,
    "kecamatanList": [
      {
        "id": "kec-cilandak",
        "nama": "Kecamatan Cilandak",
        "kabupatenKota": "Kota Jakarta Selatan",
        "namaKorcam": "H. Suryadi Pratama, S.E.",
        "noHpKorcam": "081288219901",
        "totalKelurahan": 5,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 312,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 82500,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-sukamaju",
            "nama": "Kelurahan Sukamaju",
            "kodePos": "12410",
            "namaKorkel": "Budi Santoso",
            "noHpKorkel": "081298450011",
            "totalTps": 12,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 3150,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 047",
                "namaTps": "TPS 047 Sukamaju",
                "lokasiAlamat": "Balai Warga RT 02 / RW 04, Jl. Bahagia No. 12",
                "totalDpt": 280,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Ahmad Fauzi",
                "noHpKoordinator": "081288219901",
                "statusLogistik": "Siap"
              },
              {
                "nomorTps": "TPS 048",
                "namaTps": "TPS 048 Sukamaju",
                "lokasiAlamat": "Halaman Musholla Al-Ikhlas, RT 05 / RW 04",
                "totalDpt": 295,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Bambang Tri",
                "noHpKoordinator": "081776510091",
                "statusLogistik": "Siap"
              },
              {
                "nomorTps": "TPS 049",
                "namaTps": "TPS 049 Sukamaju",
                "lokasiAlamat": "Gedung PAUD Melati, RT 01 / RW 03",
                "totalDpt": 270,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Dewi Anggraini",
                "noHpKoordinator": "081390441122",
                "statusLogistik": "Kurang"
              },
              {
                "nomorTps": "TPS 050",
                "namaTps": "TPS 050 Sukamaju",
                "lokasiAlamat": "Lapangan Bulutangkis RW 02",
                "totalDpt": 285,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              },
              {
                "nomorTps": "TPS 051",
                "namaTps": "TPS 051 Sukamaju",
                "lokasiAlamat": "Jl. Kemuning Raya No. 45",
                "totalDpt": 260,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Rudi Hartono",
                "noHpKoordinator": "081809223311",
                "statusLogistik": "Siap"
              },
              {
                "nomorTps": "TPS 052",
                "namaTps": "TPS 052 Sukamaju",
                "lokasiAlamat": "Pos Kamling RW 06",
                "totalDpt": 250,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          },
          {
            "id": "kel-cilandak-barat",
            "nama": "Kelurahan Cilandak Barat",
            "kodePos": "12430",
            "namaKorkel": "Hendra Gunawan",
            "noHpKorkel": "085211993322",
            "totalTps": 18,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4800,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 012",
                "namaTps": "TPS 012 Cilandak Barat",
                "lokasiAlamat": "SDN Cilandak Barat 03 Pagi",
                "totalDpt": 290,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Hendra Gunawan",
                "noHpKoordinator": "085211993322",
                "statusLogistik": "Siap"
              },
              {
                "nomorTps": "TPS 013",
                "namaTps": "TPS 013 Cilandak Barat",
                "lokasiAlamat": "Gedung Serbaguna RT 04 / RW 02",
                "totalDpt": 275,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Iskandar Muda",
                "noHpKoordinator": "081377889922",
                "statusLogistik": "Kurang"
              },
              {
                "nomorTps": "TPS 014",
                "namaTps": "TPS 014 Cilandak Barat",
                "lokasiAlamat": "Jl. MPR III No. 8",
                "totalDpt": 300,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          },
          {
            "id": "kel-lebak-bulus",
            "nama": "Kelurahan Lebak Bulus",
            "kodePos": "12440",
            "namaKorkel": "M. Firdaus, S.T.",
            "noHpKorkel": "081577334411",
            "totalTps": 14,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 3900,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 005",
                "namaTps": "TPS 005 Lebak Bulus",
                "lokasiAlamat": "Taman Kompas RT 01 / RW 07",
                "totalDpt": 295,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "M. Firdaus",
                "noHpKoordinator": "081577334411",
                "statusLogistik": "Siap"
              },
              {
                "nomorTps": "TPS 006",
                "namaTps": "TPS 006 Lebak Bulus",
                "lokasiAlamat": "Jl. Karang Tengah Raya",
                "totalDpt": 280,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          },
          {
            "id": "kel-gandaria-selatan",
            "nama": "Kelurahan Gandaria Selatan",
            "kodePos": "12420",
            "namaKorkel": "Rian Hidayat",
            "noHpKorkel": "081244556677",
            "totalTps": 16,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4200,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 021",
                "namaTps": "TPS 021 Gandaria Selatan",
                "lokasiAlamat": "Balai RW 03 Jl. H. Nawi",
                "totalDpt": 290,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Rian Hidayat",
                "noHpKoordinator": "081244556677",
                "statusLogistik": "Siap"
              },
              {
                "nomorTps": "TPS 022",
                "namaTps": "TPS 022 Gandaria Selatan",
                "lokasiAlamat": "Halaman SD Gandaria Selatan 01",
                "totalDpt": 275,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          },
          {
            "id": "kel-cipete-selatan",
            "nama": "Kelurahan Cipete Selatan",
            "kodePos": "12410",
            "totalTps": 15,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4100,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 001",
                "namaTps": "TPS 001 Cipete Selatan",
                "lokasiAlamat": "Jl. Cipete Raya RT 01 / RW 01",
                "totalDpt": 280,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              },
              {
                "nomorTps": "TPS 002",
                "namaTps": "TPS 002 Cipete Selatan",
                "lokasiAlamat": "Balai RW 02 Jl. Asem Dua",
                "totalDpt": 290,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-pancoran",
        "nama": "Kecamatan Pancoran",
        "kabupatenKota": "Kota Jakarta Selatan",
        "namaKorcam": "Drs. Usman Basuki",
        "noHpKorcam": "081366118833",
        "totalKelurahan": 6,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 280,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 74200,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-kalibata",
            "nama": "Kelurahan Kalibata",
            "kodePos": "12740",
            "namaKorkel": "Agus Salim, S.Kom.",
            "noHpKorkel": "081799220011",
            "totalTps": 20,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 5400,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 003",
                "namaTps": "TPS 003 Kalibata",
                "lokasiAlamat": "Taman Makam Pahlawan RT 02 / RW 01",
                "totalDpt": 285,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Agus Salim",
                "noHpKoordinator": "081799220011",
                "statusLogistik": "Siap"
              },
              {
                "nomorTps": "TPS 004",
                "namaTps": "TPS 004 Kalibata",
                "lokasiAlamat": "Komp. Pengadegan Indah Blok B",
                "totalDpt": 270,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Teguh Wibowo",
                "noHpKoordinator": "081299887766",
                "statusLogistik": "Siap"
              },
              {
                "nomorTps": "TPS 005",
                "namaTps": "TPS 005 Kalibata",
                "lokasiAlamat": "Jl. Rawajati Barat II",
                "totalDpt": 290,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          },
          {
            "id": "kel-duren-tiga",
            "nama": "Kelurahan Duren Tiga",
            "kodePos": "12760",
            "namaKorkel": "Nurdin Wahid",
            "noHpKorkel": "081388114400",
            "totalTps": 16,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4400,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 008",
                "namaTps": "TPS 008 Duren Tiga",
                "lokasiAlamat": "Kantor Kelurahan Duren Tiga",
                "totalDpt": 280,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Nurdin Wahid",
                "noHpKoordinator": "081388114400",
                "statusLogistik": "Siap"
              },
              {
                "nomorTps": "TPS 009",
                "namaTps": "TPS 009 Duren Tiga",
                "lokasiAlamat": "Jl. Laboratorium RT 05 / RW 03",
                "totalDpt": 275,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          },
          {
            "id": "kel-rawajati",
            "nama": "Kelurahan Rawajati",
            "kodePos": "12750",
            "namaKorkel": "Yanto Subagyo",
            "noHpKorkel": "081822334455",
            "totalTps": 15,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4100,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 015",
                "namaTps": "TPS 015 Rawajati",
                "lokasiAlamat": "Gedung SDN Rawajati 01 Pagi",
                "totalDpt": 290,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Yanto Subagyo",
                "noHpKoordinator": "081822334455",
                "statusLogistik": "Siap"
              }
            ]
          },
          {
            "id": "kel-cikoko",
            "nama": "Kelurahan Cikoko",
            "kodePos": "12770",
            "namaKorkel": "Eko Prasetyo",
            "noHpKorkel": "081299331122",
            "totalTps": 10,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 2700,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 002",
                "namaTps": "TPS 002 Cikoko",
                "lokasiAlamat": "Jl. Cikoko Barat Dalam RT 03",
                "totalDpt": 280,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Eko Prasetyo",
                "noHpKoordinator": "081299331122",
                "statusLogistik": "Siap"
              }
            ]
          },
          {
            "id": "kel-pengadegan",
            "nama": "Kelurahan Pengadegan",
            "kodePos": "12770",
            "namaKorkel": "Hasan Basri",
            "noHpKorkel": "081311009988",
            "totalTps": 14,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 3800,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 007",
                "namaTps": "TPS 007 Pengadegan",
                "lokasiAlamat": "Halaman Masjid Al-Hikmah",
                "totalDpt": 295,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Hasan Basri",
                "noHpKoordinator": "081311009988",
                "statusLogistik": "Siap"
              }
            ]
          },
          {
            "id": "kel-pancoran",
            "nama": "Kelurahan Pancoran",
            "kodePos": "12780",
            "totalTps": 18,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4800,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 001",
                "namaTps": "TPS 001 Pancoran",
                "lokasiAlamat": "Jl. Pancoran Barat RT 01 / RW 01",
                "totalDpt": 290,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              },
              {
                "nomorTps": "TPS 002",
                "namaTps": "TPS 002 Pancoran",
                "lokasiAlamat": "Jl. Pancoran Timur No. 15",
                "totalDpt": 285,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-pasar-minggu",
        "nama": "Kecamatan Pasar Minggu",
        "kabupatenKota": "Kota Jakarta Selatan",
        "namaKorcam": "Ir. Faisal Ramadhan",
        "noHpKorcam": "081288334455",
        "totalKelurahan": 7,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 340,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 91000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-pasar-minggu",
            "nama": "Kelurahan Pasar Minggu",
            "kodePos": "12520",
            "namaKorkel": "Dedi Kurniawan",
            "noHpKorkel": "081399441188",
            "totalTps": 22,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 5900,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 010",
                "namaTps": "TPS 010 Pasar Minggu",
                "lokasiAlamat": "Jl. Ragunan Raya RT 02 / RW 05",
                "totalDpt": 295,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Dedi Kurniawan",
                "noHpKoordinator": "081399441188",
                "statusLogistik": "Siap"
              }
            ]
          },
          {
            "id": "kel-pejaten-barat",
            "nama": "Kelurahan Pejaten Barat",
            "kodePos": "12510",
            "namaKorkel": "Lukman Hakim",
            "noHpKorkel": "081733221199",
            "totalTps": 18,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4800,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 004",
                "namaTps": "TPS 004 Pejaten Barat",
                "lokasiAlamat": "Balai Warga RW 02 Jl. Siaga Raya",
                "totalDpt": 290,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Lukman Hakim",
                "noHpKoordinator": "081733221199",
                "statusLogistik": "Siap"
              }
            ]
          },
          {
            "id": "kel-kebagusan",
            "nama": "Kelurahan Kebagusan",
            "kodePos": "12520",
            "totalTps": 16,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4300,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 001",
                "namaTps": "TPS 001 Kebagusan",
                "lokasiAlamat": "Jl. Kebagusan Raya RT 01",
                "totalDpt": 280,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-tebet",
        "nama": "Kecamatan Tebet",
        "kabupatenKota": "Kota Jakarta Selatan",
        "namaKorcam": "Hj. Ratna Juwita, M.M.",
        "noHpKorcam": "081211776655",
        "totalKelurahan": 7,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 295,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 78500,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-tebet-barat",
            "nama": "Kelurahan Tebet Barat",
            "kodePos": "12810",
            "namaKorkel": "Bagus Setyawan",
            "noHpKorkel": "081900112233",
            "totalTps": 18,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4800,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 001",
                "namaTps": "TPS 001 Tebet Barat",
                "lokasiAlamat": "Taman Tebet Eco Park RT 01",
                "totalDpt": 290,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Bagus Setyawan",
                "noHpKoordinator": "081900112233",
                "statusLogistik": "Siap"
              }
            ]
          },
          {
            "id": "kel-manggarai",
            "nama": "Kelurahan Manggarai",
            "kodePos": "12850",
            "totalTps": 17,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4600,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 001",
                "namaTps": "TPS 001 Manggarai",
                "lokasiAlamat": "Jl. Manggarai Utara RT 01",
                "totalDpt": 285,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-kebayoran-baru",
        "nama": "Kecamatan Kebayoran Baru",
        "kabupatenKota": "Kota Jakarta Selatan",
        "namaKorcam": "Bambang Soepomo",
        "noHpKorcam": "081299118844",
        "totalKelurahan": 10,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 310,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 82000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-melawai",
            "nama": "Kelurahan Melawai",
            "kodePos": "12160",
            "namaKorkel": "Iwan Setiawan",
            "noHpKorkel": "081322114477",
            "totalTps": 12,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 3200,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 001",
                "namaTps": "TPS 001 Melawai",
                "lokasiAlamat": "Balai RW 01 Jl. Melawai Raya",
                "totalDpt": 280,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Iwan Setiawan",
                "noHpKoordinator": "081322114477",
                "statusLogistik": "Siap"
              }
            ]
          },
          {
            "id": "kel-selong",
            "nama": "Kelurahan Selong",
            "kodePos": "12110",
            "totalTps": 10,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 2700,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 001",
                "namaTps": "TPS 001 Selong",
                "lokasiAlamat": "Jl. Gunawarman RT 01",
                "totalDpt": 270,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-kebayoran-lama",
        "nama": "Kecamatan Kebayoran Lama",
        "kabupatenKota": "Kota Jakarta Selatan",
        "namaKorcam": "H. Abdul Malik",
        "noHpKorcam": "081599887766",
        "totalKelurahan": 6,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 330,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 88000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-pondok-pinang",
            "nama": "Kelurahan Pondok Pinang",
            "kodePos": "12310",
            "namaKorkel": "Zulkifli Lubis",
            "noHpKorkel": "081277441100",
            "totalTps": 25,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 6800,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 005",
                "namaTps": "TPS 005 Pondok Pinang",
                "lokasiAlamat": "Jl. Deplu Raya RT 02 / RW 03",
                "totalDpt": 290,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Zulkifli Lubis",
                "noHpKoordinator": "081277441100",
                "statusLogistik": "Siap"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-mampang-prapatan",
        "nama": "Kecamatan Mampang Prapatan",
        "kabupatenKota": "Kota Jakarta Selatan",
        "namaKorcam": "Syamsul Arifin",
        "noHpKorcam": "081855443322",
        "totalKelurahan": 5,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 260,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 68000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-bangka",
            "nama": "Kelurahan Bangka",
            "kodePos": "12730",
            "namaKorkel": "Fajar Nugraha",
            "noHpKorkel": "081399881122",
            "totalTps": 18,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4800,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 003",
                "namaTps": "TPS 003 Bangka",
                "lokasiAlamat": "Jl. Kemang Timur RT 03 / RW 02",
                "totalDpt": 285,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Fajar Nugraha",
                "noHpKoordinator": "081399881122",
                "statusLogistik": "Siap"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-jagakarsa",
        "nama": "Kecamatan Jagakarsa",
        "kabupatenKota": "Kota Jakarta Selatan",
        "namaKorcam": "Drs. Subur Marzuki",
        "noHpKorcam": "081288009944",
        "totalKelurahan": 6,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 380,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 102000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-lenteng-agung",
            "nama": "Kelurahan Lenteng Agung",
            "kodePos": "12610",
            "namaKorkel": "Mansyur Hidayat",
            "noHpKorkel": "081311554477",
            "totalTps": 28,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 7600,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 014",
                "namaTps": "TPS 014 Lenteng Agung",
                "lokasiAlamat": "Jl. Raya Lenteng Agung RT 04 / RW 01",
                "totalDpt": 290,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Mansyur Hidayat",
                "noHpKoordinator": "081311554477",
                "statusLogistik": "Siap"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-pesanggrahan",
        "nama": "Kecamatan Pesanggrahan",
        "kabupatenKota": "Kota Jakarta Selatan",
        "totalKelurahan": 5,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 275,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 72000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-bintaro",
            "nama": "Kelurahan Bintaro",
            "kodePos": "12330",
            "totalTps": 20,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 5500,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 001",
                "namaTps": "TPS 001 Bintaro",
                "lokasiAlamat": "Jl. Bintaro Permai RT 01",
                "totalDpt": 280,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-setiabudi",
        "nama": "Kecamatan Setiabudi",
        "kabupatenKota": "Kota Jakarta Selatan",
        "totalKelurahan": 8,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 220,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 58000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-karet",
            "nama": "Kelurahan Karet",
            "kodePos": "12920",
            "totalTps": 15,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4000,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 001",
                "namaTps": "TPS 001 Karet",
                "lokasiAlamat": "Jl. Karet Belakang RT 01",
                "totalDpt": 275,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kab-jakpus",
    "nama": "Kota Jakarta Pusat",
    "dapil": "DAPIL DKI JAKARTA II",
    "totalKecamatan": 8,
    "kecamatanSudahAdaPendukung": 0,
    "totalKelurahan": 44,
    "kelurahanSudahAdaPendukung": 0,
    "totalTps": 2150,
    "tpsSudahAdaPendukung": 0,
    "totalDpt": 560200,
    "totalPendukung": 0,
    "persentasePenetrasi": 0,
    "sudahAdaPendukung": false,
    "kecamatanList": [
      {
        "id": "kec-tanah-abang",
        "nama": "Kecamatan Tanah Abang",
        "kabupatenKota": "Kota Jakarta Pusat",
        "namaKorcam": "H. Ridwan Kamiludin",
        "noHpKorcam": "081299003311",
        "totalKelurahan": 7,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 270,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 72000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-petamburan",
            "nama": "Kelurahan Petamburan",
            "kodePos": "10260",
            "namaKorkel": "H. Darmawan",
            "noHpKorkel": "081388441199",
            "totalTps": 22,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 5900,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 004",
                "namaTps": "TPS 004 Petamburan",
                "lokasiAlamat": "Balai RW 03 Jl. KS Tubun",
                "totalDpt": 290,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "H. Darmawan",
                "noHpKoordinator": "081388441199",
                "statusLogistik": "Siap"
              }
            ]
          },
          {
            "id": "kel-gelora",
            "nama": "Kelurahan Gelora",
            "kodePos": "10270",
            "totalTps": 8,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 2100,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 001",
                "namaTps": "TPS 001 Gelora",
                "lokasiAlamat": "Komp. GBK Senayan",
                "totalDpt": 260,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-menteng",
        "nama": "Kecamatan Menteng",
        "kabupatenKota": "Kota Jakarta Pusat",
        "namaKorcam": "drg. Hendro Wicaksono",
        "noHpKorcam": "081688113355",
        "totalKelurahan": 5,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 180,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 48000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-menteng",
            "nama": "Kelurahan Menteng",
            "kodePos": "10310",
            "namaKorkel": "Budi Wisesa",
            "noHpKorkel": "081722338844",
            "totalTps": 14,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 3700,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 002",
                "namaTps": "TPS 002 Menteng",
                "lokasiAlamat": "Taman Suropati RT 01 / RW 05",
                "totalDpt": 280,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Budi Wisesa",
                "noHpKoordinator": "081722338844",
                "statusLogistik": "Siap"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-kemayoran",
        "nama": "Kecamatan Kemayoran",
        "kabupatenKota": "Kota Jakarta Pusat",
        "namaKorcam": "Sugiarto, S.E.",
        "noHpKorcam": "081344559900",
        "totalKelurahan": 8,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 320,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 86000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-kemayoran",
            "nama": "Kelurahan Kemayoran",
            "kodePos": "10620",
            "namaKorkel": "Wahyu Ramli",
            "noHpKorkel": "081299001188",
            "totalTps": 20,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 5400,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 007",
                "namaTps": "TPS 007 Kemayoran",
                "lokasiAlamat": "Balai Warga RW 04 Garuda Raya",
                "totalDpt": 285,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Wahyu Ramli",
                "noHpKoordinator": "081299001188",
                "statusLogistik": "Siap"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-senen",
        "nama": "Kecamatan Senen",
        "kabupatenKota": "Kota Jakarta Pusat",
        "namaKorcam": "M. Taufik Hidayat",
        "noHpKorcam": "081877661122",
        "totalKelurahan": 6,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 210,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 55000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-kwitang",
            "nama": "Kelurahan Kwitang",
            "kodePos": "10420",
            "namaKorkel": "Rahmat Hidayat",
            "noHpKorkel": "081388002244",
            "totalTps": 16,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4300,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 003",
                "namaTps": "TPS 003 Kwitang",
                "lokasiAlamat": "Jl. Kwitang Raya No. 20",
                "totalDpt": 280,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "namaKoordinatorTps": "Rahmat Hidayat",
                "noHpKoordinator": "081388002244",
                "statusLogistik": "Siap"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-gambir",
        "nama": "Kecamatan Gambir",
        "kabupatenKota": "Kota Jakarta Pusat",
        "totalKelurahan": 6,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 190,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 50000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-petojo-selatan",
            "nama": "Kelurahan Petojo Selatan",
            "kodePos": "10160",
            "totalTps": 14,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 3800,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 001",
                "namaTps": "TPS 001 Petojo Selatan",
                "lokasiAlamat": "Jl. Suryopranoto RT 01",
                "totalDpt": 275,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          }
        ]
      },
      {
        "id": "kec-sawah-besar",
        "nama": "Kecamatan Sawah Besar",
        "kabupatenKota": "Kota Jakarta Pusat",
        "totalKelurahan": 5,
        "kelurahanSudahAdaPendukung": 0,
        "totalTps": 185,
        "tpsSudahAdaPendukung": 0,
        "totalDpt": 48000,
        "totalPendukung": 0,
        "persentasePenetrasi": 0,
        "sudahAdaPendukung": false,
        "kelurahanList": [
          {
            "id": "kel-pasar-baru",
            "nama": "Kelurahan Pasar Baru",
            "kodePos": "10710",
            "totalTps": 15,
            "tpsSudahAdaPendukung": 0,
            "totalDpt": 4000,
            "totalPendukung": 0,
            "persentasePenetrasi": 0,
            "sudahAdaPendukung": false,
            "tpsList": [
              {
                "nomorTps": "TPS 001",
                "namaTps": "TPS 001 Pasar Baru",
                "lokasiAlamat": "Pintu Air Pasar Baru RT 01",
                "totalDpt": 270,
                "jumlahPendukung": 0,
                "persentasePenetrasi": 0,
                "sudahAdaPendukung": false,
                "statusLogistik": "Belum Terdistribusi"
              }
            ]
          }
        ]
      }
    ]
  }
];
