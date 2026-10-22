import React, { useState, useMemo } from 'react';
import {
  INITIAL_PETA_SUARA_DATA,
  KabupatenPetaRecord,
  KecamatanPetaRecord,
  KelurahanPetaRecord,
  TpsPetaRecord,
} from '../../../data/petaSuaraData';
import { VoterOcrRecord, DptVoterRecord } from '../../../types/vore';
import {
  Compass,
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle,
  Users,
  ChevronRight,
  ChevronDown,
  Building2,
  Map as MapIcon,
  Filter,
  Phone,
  Package,
  Layers,
  Sparkles,
  Download,
  Share2,
  X,
  UserPlus,
  Send,
  ExternalLink,
  Info,
} from 'lucide-react';

interface MonitoringPetaSuaraScreenProps {
  voterList?: VoterOcrRecord[];
  dptList?: DptVoterRecord[];
  onOpenWhatsAppBlazt?: () => void;
  onNavigateTab?: (tab: 'beranda' | 'aspirasi' | 'peta_suara' | 'tps' | 'profil') => void;
  onOpenTambahNikModal?: () => void;
}

export const MonitoringPetaSuaraScreen: React.FC<MonitoringPetaSuaraScreenProps> = ({
  voterList = [],
  dptList = [],
  onOpenWhatsAppBlazt,
  onNavigateTab,
  onOpenTambahNikModal,
}) => {
  // Navigation / Selection State
  const [selectedKabId, setSelectedKabId] = useState<string>('kab-jaksel');
  const [selectedKecId, setSelectedKecId] = useState<string | null>('kec-cilandak');
  const [selectedKelId, setSelectedKelId] = useState<string | null>('kel-sukamaju');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sudah' | 'belum'>('all');
  const [viewMode, setViewMode] = useState<'hirarki' | 'peta' | 'blank_spots'>('hirarki');

  // Selected Item Detail Modal
  const [selectedTpsDetail, setSelectedTpsDetail] = useState<TpsPetaRecord | null>(null);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Dynamic aggregation: Merge live registered voters from Kader and Tim Sukses into Peta Suara
  const dynamicPetaSuaraData = useMemo(() => {
    const allVoters: { nik: string; tps: string; kelurahan: string; kecamatan: string }[] = [];
    const seenNiks = new Set<string>();

    (voterList || []).forEach((v) => {
      if (v.nik && !seenNiks.has(v.nik)) {
        seenNiks.add(v.nik);
        allVoters.push({
          nik: v.nik,
          tps: v.tps || '',
          kelurahan: v.kelurahan || '',
          kecamatan: v.kecamatan || '',
        });
      }
    });

    (dptList || []).forEach((d) => {
      if (d.nik && !seenNiks.has(d.nik)) {
        seenNiks.add(d.nik);
        allVoters.push({
          nik: d.nik,
          tps: d.tps || '',
          kelurahan: d.kelurahan || '',
          kecamatan: d.kecamatan || '',
        });
      }
    });

    const norm = (s?: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    return INITIAL_PETA_SUARA_DATA.map((kab) => {
      let kabPendukung = 0;
      let kabTpsTerisi = 0;
      let kabKelTerisi = 0;
      let kabKecTerisi = 0;

      const updatedKecList = kab.kecamatanList.map((kec) => {
        let kecPendukung = 0;
        let kecTpsTerisi = 0;
        let kecKelTerisi = 0;

        const updatedKelList = kec.kelurahanList.map((kel) => {
          let kelPendukung = 0;
          let kelTpsTerisi = 0;

          const updatedTpsList = kel.tpsList.map((tps) => {
            const tpsVoters = allVoters.filter((v) => {
              const matchesTps = norm(v.tps).includes(norm(tps.nomorTps)) || norm(tps.nomorTps).includes(norm(v.tps));
              const matchesKel = norm(v.kelurahan).includes(norm(kel.nama)) || norm(kel.nama).includes(norm(v.kelurahan));
              return matchesTps || (matchesKel && norm(v.tps) === norm(tps.nomorTps));
            });

            const count = tpsVoters.length;
            const hasSupporters = count > 0;
            if (hasSupporters) kelTpsTerisi += 1;
            kelPendukung += count;

            return {
              ...tps,
              jumlahPendukung: count,
              persentasePenetrasi: tps.totalDpt > 0 ? (count / tps.totalDpt) * 100 : 0,
              sudahAdaPendukung: hasSupporters,
            };
          });

          const kelHasSupporters = kelPendukung > 0;
          if (kelHasSupporters) kecKelTerisi += 1;
          kecTpsTerisi += kelTpsTerisi;
          kecPendukung += kelPendukung;

          return {
            ...kel,
            totalPendukung: kelPendukung,
            tpsSudahAdaPendukung: kelTpsTerisi,
            sudahAdaPendukung: kelHasSupporters,
            persentasePenetrasi: kel.totalDpt > 0 ? (kelPendukung / kel.totalDpt) * 100 : 0,
            tpsList: updatedTpsList,
          };
        });

        const kecHasSupporters = kecPendukung > 0;
        if (kecHasSupporters) kabKecTerisi += 1;
        kabKelTerisi += kecKelTerisi;
        kabTpsTerisi += kecTpsTerisi;
        kabPendukung += kecPendukung;

        return {
          ...kec,
          totalPendukung: kecPendukung,
          kelurahanSudahAdaPendukung: kecKelTerisi,
          tpsSudahAdaPendukung: kecTpsTerisi,
          sudahAdaPendukung: kecHasSupporters,
          persentasePenetrasi: kec.totalDpt > 0 ? (kecPendukung / kec.totalDpt) * 100 : 0,
          kelurahanList: updatedKelList,
        };
      });

      return {
        ...kab,
        totalPendukung: kabPendukung,
        kecamatanSudahAdaPendukung: kabKecTerisi,
        kelurahanSudahAdaPendukung: kabKelTerisi,
        tpsSudahAdaPendukung: kabTpsTerisi,
        sudahAdaPendukung: kabPendukung > 0,
        persentasePenetrasi: kab.totalDpt > 0 ? (kabPendukung / kab.totalDpt) * 100 : 0,
        kecamatanList: updatedKecList,
      };
    });
  }, [voterList, dptList]);

  // Active Kabupaten
  const currentKab = useMemo(() => {
    return (
      dynamicPetaSuaraData.find((k) => k.id === selectedKabId) ||
      dynamicPetaSuaraData[0]
    );
  }, [dynamicPetaSuaraData, selectedKabId]);

  // Active Kecamatan
  const currentKec = useMemo(() => {
    if (!selectedKecId) return null;
    return currentKab.kecamatanList.find((kec) => kec.id === selectedKecId) || null;
  }, [currentKab, selectedKecId]);

  // Active Kelurahan
  const currentKel = useMemo(() => {
    if (!currentKec || !selectedKelId) return null;
    return currentKec.kelurahanList.find((kel) => kel.id === selectedKelId) || null;
  }, [currentKec, selectedKelId]);

  // Global Totals across Dapil
  const dapilStats = useMemo(() => {
    let totalKab = dynamicPetaSuaraData.length;
    let totalKec = 0;
    let kecTerisi = 0;
    let totalKel = 0;
    let kelTerisi = 0;
    let totalTps = 0;
    let tpsTerisi = 0;
    let totalDpt = 0;
    let totalPendukung = 0;

    dynamicPetaSuaraData.forEach((kab) => {
      totalKec += kab.totalKecamatan;
      kecTerisi += kab.kecamatanSudahAdaPendukung;
      totalKel += kab.totalKelurahan;
      kelTerisi += kab.kelurahanSudahAdaPendukung;
      totalTps += kab.totalTps;
      tpsTerisi += kab.tpsSudahAdaPendukung;
      totalDpt += kab.totalDpt;
      totalPendukung += kab.totalPendukung;
    });

    const blankKelurahanCount = totalKel - kelTerisi;
    const blankTpsCount = totalTps - tpsTerisi;
    const pctPenetrasiDapil = totalDpt > 0 ? ((totalPendukung / totalDpt) * 100).toFixed(1) : '0';

    return {
      totalKab,
      totalKec,
      kecTerisi,
      blankKec: totalKec - kecTerisi,
      totalKel,
      kelTerisi,
      blankKel: blankKelurahanCount,
      totalTps,
      tpsTerisi,
      blankTps: blankTpsCount,
      totalDpt,
      totalPendukung,
      pctPenetrasiDapil,
    };
  }, []);

  // Filtered List of Kecamatans based on search and status filter
  const filteredKecamatanList = useMemo(() => {
    return currentKab.kecamatanList.filter((kec) => {
      const matchSearch =
        kec.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kec.kelurahanList.some((kel) =>
          kel.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kel.tpsList.some((t) => t.namaTps.toLowerCase().includes(searchQuery.toLowerCase()))
        );

      if (!matchSearch) return false;

      if (statusFilter === 'sudah') return kec.sudahAdaPendukung;
      if (statusFilter === 'belum') return !kec.sudahAdaPendukung;
      return true;
    });
  }, [currentKab, searchQuery, statusFilter]);

  // List of all Blank Spots (Kelurahan / TPS that have NO supporters)
  const allBlankSpots = useMemo(() => {
    const list: {
      kabNama: string;
      kecNama: string;
      kelNama: string;
      tipe: 'Kecamatan' | 'Kelurahan' | 'TPS';
      namaLokasi: string;
      dpt: number;
    }[] = [];

    dynamicPetaSuaraData.forEach((kab) => {
      kab.kecamatanList.forEach((kec) => {
        if (!kec.sudahAdaPendukung) {
          list.push({
            kabNama: kab.nama,
            kecNama: kec.nama,
            kelNama: '-',
            tipe: 'Kecamatan',
            namaLokasi: `${kec.nama} (Seluruh Wilayah Kosong)`,
            dpt: kec.totalDpt,
          });
        }
        kec.kelurahanList.forEach((kel) => {
          if (!kel.sudahAdaPendukung) {
            list.push({
              kabNama: kab.nama,
              kecNama: kec.nama,
              kelNama: kel.nama,
              tipe: 'Kelurahan',
              namaLokasi: `${kel.nama} (${kec.nama})`,
              dpt: kel.totalDpt,
            });
          }
          kel.tpsList.forEach((tps) => {
            if (!tps.sudahAdaPendukung) {
              list.push({
                kabNama: kab.nama,
                kecNama: kec.nama,
                kelNama: kel.nama,
                tipe: 'TPS',
                namaLokasi: `${tps.namaTps} - ${tps.lokasiAlamat}`,
                dpt: tps.totalDpt,
              });
            }
          });
        });
      });
    });

    return list;
  }, []);

  const triggerToast = (msg: string) => {
    setActionSuccessToast(msg);
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  return (
    <div className="flex flex-col space-y-4 pb-12 text-slate-800">
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white border border-cyan-400 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* Screen Title & Subtitle (Optimized for iOS & Android Viewports) */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-tight">
            Monitoring Peta Suara
          </h1>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Peta suara pendukung berdasarkan nama Kab, Kec, Desa/Kelurahan hingga TPS untuk memetakan seluruh wilayah dapil yang sudah ada pendukung maupun yang belum.
        </p>

        {/* View Switcher: Hierarki vs Peta Visual vs Blank Spots (Fully responsive, no truncation on iOS & Android) */}
        <div className="w-full grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/90 text-center">
          <button
            onClick={() => setViewMode('hirarki')}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 leading-tight ${
              viewMode === 'hirarki'
                ? 'bg-white text-cyan-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0 text-cyan-600" />
            <span className="break-words">Wilayah</span>
          </button>
          <button
            onClick={() => setViewMode('peta')}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 leading-tight ${
              viewMode === 'peta'
                ? 'bg-white text-cyan-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
            <span className="break-words">Peta Suara</span>
          </button>
          <button
            onClick={() => setViewMode('blank_spots')}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 leading-tight ${
              viewMode === 'blank_spots'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="break-words">Zona Kosong ({allBlankSpots.length})</span>
          </button>
        </div>

        {/* Quick Action Button: Input Manual NIK untuk Mengundang Teman & Mengisi Peta Suara */}
        {onOpenTambahNikModal && (
          <button
            onClick={onOpenTambahNikModal}
            className="w-full py-2.5 px-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl font-bold text-xs flex items-center justify-between shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              <div className="text-left min-w-0">
                <span className="block text-[11px] font-black leading-tight">
                  + Input Manual: Tambah NIK Undang Teman
                </span>
                <span className="block text-[9px] text-cyan-100 font-normal leading-tight mt-0.5">
                  Input 16 digit NIK kawan / tetangga untuk memperluas suara di TPS
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-cyan-200 shrink-0 ml-1" />
          </button>
        )}
      </div>

      {/* Macro Summary Banner: Status Penetrasi Dapil (Adapted for iOS & Android, zero truncation) */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white shadow-md space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
              DAPIL DKI JAKARTA II
            </span>
            <span className="text-[10px] text-slate-300 font-medium">
              Total {dapilStats.totalDpt.toLocaleString('id-ID')} DPT
            </span>
          </div>

          <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            {dapilStats.pctPenetrasiDapil}% Penetrasi Suara
          </span>
        </div>

        {dapilStats.totalPendukung === 0 && (
          <div className="p-2.5 bg-cyan-950/80 border border-cyan-500/40 rounded-2xl flex items-center gap-2 text-[11px] text-cyan-200 shadow-inner">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Peta Suara Bersih (0 Suara): Data akan terisi otomatis saat kader mendaftarkan pemilih KTP atau saksi mengunggah C1 Plano.</span>
          </div>
        )}

        {/* 4 Stats Cards: Fully visible on iOS and Android without any text truncation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-0.5">
          <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10 flex flex-col justify-center min-w-0">
            <span className="text-[10px] text-slate-300 block font-semibold leading-tight">
              Total Pendukung
            </span>
            <span className="text-base sm:text-lg font-black font-mono text-cyan-300 mt-0.5 block tabular-nums">
              {dapilStats.totalPendukung.toLocaleString('id-ID')}
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">
              Terkunci &amp; Terdata
            </span>
          </div>

          <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10 flex flex-col justify-center min-w-0">
            <span className="text-[10px] text-slate-300 block font-semibold leading-tight">
              Kecamatan Terisi
            </span>
            <span className="text-base sm:text-lg font-black font-mono text-white mt-0.5 block tabular-nums">
              {dapilStats.kecTerisi}/{dapilStats.totalKec}
            </span>
            <span className="text-[9px] text-emerald-400 font-bold block mt-0.5 leading-tight">
              {Math.round((dapilStats.kecTerisi / dapilStats.totalKec) * 100)}% Wilayah
            </span>
          </div>

          <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10 flex flex-col justify-center min-w-0">
            <span className="text-[10px] text-slate-300 block font-semibold leading-tight">
              Kelurahan Terisi
            </span>
            <span className="text-base sm:text-lg font-black font-mono text-teal-300 mt-0.5 block tabular-nums">
              {dapilStats.kelTerisi}/{dapilStats.totalKel}
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">
              {dapilStats.blankKel} Blank Spot
            </span>
          </div>

          <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10 flex flex-col justify-center min-w-0">
            <span className="text-[10px] text-slate-300 block font-semibold leading-tight">
              TPS Terjangkau
            </span>
            <span className="text-base sm:text-lg font-black font-mono text-amber-300 mt-0.5 block tabular-nums">
              {dapilStats.tpsTerisi.toLocaleString('id-ID')}
            </span>
            <span className="text-[9px] text-amber-300 font-bold block mt-0.5 leading-tight">
              {Math.round((dapilStats.tpsTerisi / dapilStats.totalTps) * 100)}% TPS
            </span>
          </div>
        </div>

        {/* Progress Bar Penetrasi */}
        <div className="pt-2 border-t border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] flex-wrap gap-1">
            <span className="text-slate-300 font-medium">Cakupan Wilayah: Sudah Ada Pendukung</span>
            <span className="font-mono text-cyan-200 font-bold">
              {dapilStats.tpsTerisi.toLocaleString('id-ID')} TPS Terisi · {dapilStats.blankTps.toLocaleString('id-ID')} Kosong
            </span>
          </div>
          <div className="h-2 w-full bg-slate-700/80 rounded-full overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full transition-all duration-700"
              style={{ width: `${(dapilStats.tpsTerisi / dapilStats.totalTps) * 100}%` }}
              title="Wilayah Sudah Ada Pendukung"
            ></div>
            <div
              className="bg-rose-500/80 h-full transition-all duration-700"
              style={{ width: `${(dapilStats.blankTps / dapilStats.totalTps) * 100}%` }}
              title="Wilayah Belum Ada Pendukung (Blank Spot)"
            ></div>
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5 flex-wrap gap-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Sudah Ada Pendukung ({Math.round((dapilStats.tpsTerisi / dapilStats.totalTps) * 100)}%)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              <span>Belum Ada Pendukung ({Math.round((dapilStats.blankTps / dapilStats.totalTps) * 100)}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Kabupaten / Kota Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {dynamicPetaSuaraData.map((kab) => {
          const isSelected = selectedKabId === kab.id;
          return (
            <button
              key={kab.id}
              onClick={() => {
                setSelectedKabId(kab.id);
                setSelectedKecId(kab.kecamatanList[0]?.id || null);
                setSelectedKelId(kab.kecamatanList[0]?.kelurahanList[0]?.id || null);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{kab.nama}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  isSelected ? 'bg-cyan-700 text-cyan-100' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {kab.totalPendukung.toLocaleString('id-ID')} Pendukung
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama Kab, Kec, Desa/Kelurahan, atau TPS..."
            className="w-full text-xs pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" />
            <span>Filter Status:</span>
          </span>

          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Wilayah
          </button>

          <button
            onClick={() => setStatusFilter('sudah')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
              statusFilter === 'sudah'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Sudah Ada Pendukung</span>
          </button>

          <button
            onClick={() => setStatusFilter('belum')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
              statusFilter === 'belum'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Belum Ada Pendukung</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: HIERARCHICAL DRILLDOWN (KAB -> KEC -> KEL -> TPS) */}
      {viewMode === 'hirarki' && (
        <div className="space-y-3">
          {/* Breadcrumb Path */}
          <div className="p-2.5 bg-slate-100/90 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-800 font-bold">{currentKab.nama}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className={currentKec ? 'text-slate-800 font-bold' : 'text-slate-400'}>
              {currentKec?.nama || 'Pilih Kecamatan'}
            </span>
            {currentKel && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-cyan-700 font-bold">{currentKel.nama}</span>
              </>
            )}
          </div>

          {/* List of Kecamatans */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Daftar Kecamatan di {currentKab.nama} ({filteredKecamatanList.length})
              </h2>
              <span className="text-[10px] text-slate-400">Klik kecamatan untuk rincian TPS</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {filteredKecamatanList.map((kec) => {
                const isSelected = selectedKecId === kec.id;
                return (
                  <div
                    key={kec.id}
                    className={`rounded-2xl border transition-all overflow-hidden bg-white shadow-2xs ${
                      isSelected
                        ? 'border-cyan-500 ring-2 ring-cyan-400/20'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    {/* Kecamatan Card Header */}
                    <div
                      onClick={() => {
                        setSelectedKecId(isSelected ? null : kec.id);
                        if (!isSelected && kec.kelurahanList.length > 0) {
                          setSelectedKelId(kec.kelurahanList[0].id);
                        }
                      }}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            kec.sudahAdaPendukung
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {kec.sudahAdaPendukung ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-rose-600" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-bold text-slate-900">{kec.nama}</h3>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                kec.sudahAdaPendukung
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800 font-mono'
                              }`}
                            >
                              {kec.sudahAdaPendukung
                                ? '✓ Ada Pendukung'
                                : '⚠ Belum Ada Pendukung'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span>
                              <strong>{kec.totalPendukung.toLocaleString('id-ID')}</strong> Pendukung
                            </span>
                            <span>·</span>
                            <span>{kec.totalDpt.toLocaleString('id-ID')} DPT</span>
                            <span>·</span>
                            <span className="font-bold text-cyan-700">
                              {kec.persentasePenetrasi}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right hidden sm:block">
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            Cakupan Kelurahan
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {kec.kelurahanSudahAdaPendukung}/{kec.totalKelurahan} Kel.
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            isSelected ? 'rotate-180 text-cyan-600' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Kelurahan & TPS Drilldown */}
                    {isSelected && (
                      <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                        {/* Koordinator Kecamatan Card */}
                        {kec.namaKorcam ? (
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                                K
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block font-semibold">
                                  Koordinator Kecamatan (Korcam)
                                </span>
                                <span className="font-bold text-slate-800">{kec.namaKorcam}</span>
                              </div>
                            </div>
                            <a
                              href={`https://wa.me/62${kec.noHpKorcam?.replace(/^0/, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-2xs"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Hubungi</span>
                            </a>
                          </div>
                        ) : (
                          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                              <span>Belum ada Koordinator Kecamatan (Korcam) ditugaskan.</span>
                            </div>
                            <button
                              onClick={() => triggerToast(`Penugasan Relawan untuk ${kec.nama} telah dicatat!`)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg shrink-0 cursor-pointer"
                            >
                              + Tugaskan Korcam
                            </button>
                          </div>
                        )}

                        {/* Kelurahan Selection Pills */}
                        <div>
                          <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                            Pilih Desa / Kelurahan:
                          </span>
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                            {kec.kelurahanList.map((kel) => {
                              const isKelActive = selectedKelId === kel.id;
                              return (
                                <button
                                  key={kel.id}
                                  onClick={() => setSelectedKelId(kel.id)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                                    isKelActive
                                      ? 'bg-cyan-600 text-white shadow-xs'
                                      : kel.sudahAdaPendukung
                                      ? 'bg-white text-slate-700 border border-slate-200 hover:border-cyan-300'
                                      : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      kel.sudahAdaPendukung ? 'bg-emerald-400' : 'bg-rose-500'
                                    }`}
                                  ></span>
                                  <span>{kel.nama}</span>
                                  <span className="text-[10px] opacity-80 font-mono">
                                    ({kel.totalPendukung})
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Active Kelurahan Detail & TPS List */}
                        {currentKel && (
                          <div className="p-3 bg-white rounded-2xl border border-slate-200/90 space-y-2.5 shadow-2xs">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-bold text-slate-900">
                                    {currentKel.nama} (Kodepos: {currentKel.kodePos})
                                  </h4>
                                  <span
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                      currentKel.sudahAdaPendukung
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}
                                  >
                                    {currentKel.sudahAdaPendukung
                                      ? '✓ Sudah Ada Pendukung'
                                      : '⚠ Belum Ada Pendukung'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  Total DPT: {currentKel.totalDpt.toLocaleString('id-ID')} · Pendukung:{' '}
                                  {currentKel.totalPendukung.toLocaleString('id-ID')} (
                                  {currentKel.persentasePenetrasi}%)
                                </p>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 font-semibold block">
                                  Cakupan TPS
                                </span>
                                <span className="text-xs font-extrabold text-cyan-800 font-mono">
                                  {currentKel.tpsSudahAdaPendukung}/{currentKel.totalTps} TPS
                                </span>
                              </div>
                            </div>

                            {/* TPS List within this Kelurahan */}
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[11px] font-bold text-slate-700 block">
                                Rincian Pemetaan TPS:
                              </span>

                              <div className="space-y-1.5">
                                {currentKel.tpsList.map((tps) => (
                                  <div
                                    key={tps.nomorTps}
                                    onClick={() => setSelectedTpsDetail(tps)}
                                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                      tps.sudahAdaPendukung
                                        ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                                        : 'bg-rose-50/40 border-rose-200 hover:border-rose-400'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2 min-w-0">
                                      <div
                                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                                          tps.sudahAdaPendukung
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-rose-400 text-white'
                                        }`}
                                      >
                                        {tps.sudahAdaPendukung ? '✓' : '!'}
                                      </div>

                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-bold text-slate-900 block truncate">
                                            {tps.namaTps}
                                          </span>
                                          <span
                                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                              tps.sudahAdaPendukung
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-rose-100 text-rose-800'
                                            }`}
                                          >
                                            {tps.sudahAdaPendukung
                                              ? `${tps.jumlahPendukung} Pendukung`
                                              : 'Kosong (0)'}
                                          </span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 block truncate">
                                          {tps.lokasiAlamat}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="text-right shrink-0 flex items-center gap-2">
                                      <div>
                                        <span className="text-[10px] font-mono font-bold text-slate-700 block">
                                          {tps.persentasePenetrasi}%
                                        </span>
                                        <span className="text-[9px] text-slate-400">
                                          {tps.totalDpt} DPT
                                        </span>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: INTERACTIVE VISUAL MAP */}
      {viewMode === 'peta' && (
        <div className="space-y-3">
          <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900">
                  Visual Heatmap Peta Suara Dapil
                </h3>
                <p className="text-[11px] text-slate-500">
                  Warna merefleksikan tingkat penetrasi suara pendukung di setiap wilayah.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                  <span>Kuat (&gt;25%)</span>
                </span>
                <span className="flex items-center gap-1 text-cyan-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span>
                  <span>Sedang (10-25%)</span>
                </span>
                <span className="flex items-center gap-1 text-rose-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-400"></span>
                  <span>Blank (0%)</span>
                </span>
              </div>
            </div>

            {/* Interactive Grid Map representation */}
            <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                <span>PETA ELEKTORAL: {currentKab.nama.toUpperCase()}</span>
                <span>STATUS LIVE SINKRON</span>
              </div>

              {/* Map grid representing subdistricts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {currentKab.kecamatanList.map((kec) => (
                  <button
                    key={kec.id}
                    onClick={() => {
                      setSelectedKecId(kec.id);
                      setSelectedKelId(kec.kelurahanList[0]?.id || null);
                      setViewMode('hirarki');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                      kec.persentasePenetrasi >= 25
                        ? 'bg-emerald-950/70 border-emerald-500/60 hover:border-emerald-400'
                        : kec.persentasePenetrasi > 0
                        ? 'bg-cyan-950/70 border-cyan-500/60 hover:border-cyan-400'
                        : 'bg-rose-950/60 border-rose-500/60 hover:border-rose-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-200">
                        {kec.nama.replace('Kecamatan ', '')}
                      </span>
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm ${
                          kec.sudahAdaPendukung
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {kec.sudahAdaPendukung ? `${kec.persentasePenetrasi}%` : '0%'}
                      </span>
                    </div>

                    <div className="mt-2 text-[10px] text-slate-300 flex items-center justify-between">
                      <span>{kec.totalPendukung.toLocaleString('id-ID')} Pendukung</span>
                      <span className="font-mono text-slate-400">{kec.totalTps} TPS</span>
                    </div>

                    <div className="mt-1.5 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          kec.persentasePenetrasi >= 25
                            ? 'bg-emerald-400'
                            : kec.persentasePenetrasi > 0
                            ? 'bg-cyan-400'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, kec.persentasePenetrasi * 3)}%` }}
                      ></div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Klik salah satu zona kecamatan di atas untuk membuka daftar TPS &amp; Relawan.</span>
                <span className="text-cyan-300 font-bold">Navigasi Langsung →</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: ALL BLANK SPOTS (WILAYAH YANG BELUM ADA PENDUKUNG) */}
      {viewMode === 'blank_spots' && (
        <div className="space-y-3">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-3xl space-y-2 text-rose-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <h3 className="text-sm font-black">
                Daftar Wilayah Blank Spot (Belum Ada Pendukung)
              </h3>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Kandidat dan tim sukses dapat menggunakan daftar ini untuk mengidentifikasi area yang belum tersentuh relawan, sehingga dapat segera menugaskan kader lapangan atau mengirimkan logistik pemenangan.
            </p>
          </div>

          <div className="space-y-2">
            {allBlankSpots.map((spot, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-2xl border border-rose-200/90 shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    {spot.tipe === 'Kecamatan' ? 'Kec' : spot.tipe === 'Kelurahan' ? 'Kel' : 'TPS'}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">
                      {spot.tipe} · {spot.kabNama}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">{spot.namaLokasi}</h4>
                    <span className="text-[10px] text-slate-500">
                      Potensi DPT: {spot.dpt.toLocaleString('id-ID')} Pemilih
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    triggerToast(`Wilayah ${spot.namaLokasi} berhasil ditambahkan ke agenda ekspansi relawan!`)
                  }
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Kirim Relawan</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TPS DETAIL & ACTION MODAL */}
      {selectedTpsDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-600 block">
                  Detail Pemetaan TPS
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {selectedTpsDetail.namaTps}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTpsDetail(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold">Alamat Lokasi:</span>
                <p className="font-semibold text-slate-800">{selectedTpsDetail.lokasiAlamat}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-cyan-50 rounded-xl border border-cyan-100">
                  <span className="text-[9px] text-cyan-700 block font-semibold">Total DPT</span>
                  <span className="text-sm font-black text-cyan-900 font-mono mt-0.5 block">
                    {selectedTpsDetail.totalDpt}
                  </span>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-[9px] text-emerald-700 block font-semibold">Pendukung</span>
                  <span className="text-sm font-black text-emerald-900 font-mono mt-0.5 block">
                    {selectedTpsDetail.jumlahPendukung}
                  </span>
                </div>
                <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                  <span className="text-[9px] text-indigo-700 block font-semibold">Penetrasi</span>
                  <span className="text-sm font-black text-indigo-900 font-mono mt-0.5 block">
                    {selectedTpsDetail.persentasePenetrasi}%
                  </span>
                </div>
              </div>

              {/* Koordinator Info */}
              <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Koordinator TPS
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      selectedTpsDetail.statusLogistik === 'Siap'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Logistik: {selectedTpsDetail.statusLogistik}
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-sm">
                  {selectedTpsDetail.namaKoordinatorTps || 'Belum Ada Koordinator TPS'}
                </p>
                {selectedTpsDetail.noHpKoordinator ? (
                  <p className="text-[11px] text-slate-500 font-mono">
                    Kontak: {selectedTpsDetail.noHpKoordinator}
                  </p>
                ) : (
                  <p className="text-[10px] text-rose-500">
                    ⚠ Segera tugaskan relawan TPS untuk mengawal suara.
                  </p>
                )}
              </div>
            </div>

            {onOpenTambahNikModal && (
              <button
                onClick={() => {
                  setSelectedTpsDetail(null);
                  onOpenTambahNikModal();
                }}
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-98"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Input Manual NIK Teman di {selectedTpsDetail.namaTps}</span>
              </button>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              {selectedTpsDetail.noHpKoordinator && (
                <a
                  href={`https://wa.me/62${selectedTpsDetail.noHpKoordinator.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Koordinator</span>
                </a>
              )}

              <button
                onClick={() => {
                  triggerToast(`Status logistik & relawan ${selectedTpsDetail.namaTps} telah diperbarui!`);
                  setSelectedTpsDetail(null);
                }}
                className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Kirim Logistik TPS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
