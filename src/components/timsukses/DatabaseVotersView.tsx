import React, { useState, useMemo } from 'react';
import { VoterOcrRecord } from '../../types/vore';
import {
  LAPORAN_VOTER_PER_TPS,
  HASIL_QUICK_COUNT_PEMETAAN,
  RINCIAN_OCR_CALEG_PASLON,
} from '../../data/accountsData';
import {
  Search,
  Filter,
  Download,
  Users,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  PieChart,
  BarChart3,
  Calendar,
  X,
  Share2,
  Printer,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  CreditCard,
} from 'lucide-react';

interface DatabaseVotersViewProps {
  voterList: VoterOcrRecord[];
  onOpenDaftarVoterModal?: () => void;
}

export const DatabaseVotersView: React.FC<DatabaseVotersViewProps> = ({
  voterList,
  onOpenDaftarVoterModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKota, setSelectedKota] = useState<string>('Semua');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('Semua');
  const [selectedTps, setSelectedTps] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'perlu_cek'>('all');
  const [activeSubTab, setActiveSubTab] = useState<'voters' | 'rekap_tps' | 'quick_count_pemetaan' | 'rincian_ocr'>('voters');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Filtered Voters
  const filteredVoters = useMemo(() => {
    return voterList.filter((voter) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        voter.nama.toLowerCase().includes(q) ||
        voter.nik.includes(q) ||
        voter.tps.toLowerCase().includes(q) ||
        voter.kelurahan.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (selectedKota !== 'Semua' && voter.kabupatenKota !== selectedKota) return false;
      if (selectedKecamatan !== 'Semua' && voter.kecamatan !== selectedKecamatan) return false;
      if (selectedTps !== 'Semua' && voter.tps !== selectedTps) return false;

      if (statusFilter === 'valid' && voter.statusDpt !== 'DPT valid') return false;
      if (statusFilter === 'perlu_cek' && voter.statusDpt !== 'Perlu cek') return false;

      return true;
    });
  }, [voterList, searchQuery, selectedKota, selectedKecamatan, selectedTps, statusFilter]);

  // Demographic stats (Slide 5: L 54%, P 46%, 17-35 th 61%)
  const totalCount = filteredVoters.length;
  const lakiCount = filteredVoters.filter((v) => v.jenisKelamin === 'Laki-laki').length;
  const perempuanCount = totalCount - lakiCount;
  const pctLaki = totalCount > 0 ? Math.round((lakiCount / totalCount) * 100) : 0;
  const pctPerempuan = totalCount > 0 ? 100 - pctLaki : 0;

  // Handle Export to CSV / Excel simulator
  const handleExport = (format: 'Excel' | 'PDF' | 'CSV') => {
    const headers = ['NIK', 'Nama', 'Jenis Kelamin', 'TPS', 'Kelurahan', 'Kecamatan', 'Status DPT', 'Waktu'];
    const rows = filteredVoters.map((v) => [
      v.nik,
      v.nama,
      v.jenisKelamin,
      v.tps,
      v.kelurahan,
      v.kecamatan,
      v.statusDpt,
      v.waktuDaftar,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Database_Voters_${format}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`Laporan Database Voters (${format}) berhasil diekspor!`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Toast Notification */}
      {exportNotice && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white border border-teal-400 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Header Banner (Slide 4 & 5) */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-cyan-300 font-bold border border-white/10">
              <span>MODUL 02</span>
              <span>·</span>
              <span>TIM SUKSES PEMENANGAN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Database Voters • Cari, Filter, Ekspor
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Data voter, demografi, status DPT, dan wilayah bertingkat dalam satu alur kerja terintegrasi.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleExport('Excel')}
              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor PDF</span>
            </button>
          </div>
        </div>

        {/* 4 Cards Summary from Slide 5 & 11 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-2 border-t border-white/10">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Total Voters Terdata
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black font-mono text-cyan-300">
                {totalCount.toLocaleString('id-ID')} voter
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold">
              {totalCount > 0 ? ((totalCount / 580) * 100).toFixed(1) + '% capaian' : '0% (Belum ada data)'}
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Wilayah Terfokus
            </span>
            <span className="text-lg font-black text-white block mt-0.5">
              {totalCount > 0 ? 'TPS 047 • Sukamaju' : 'Semua Wilayah'}
            </span>
            <span className="text-[10px] text-slate-400">Kec. Cilandak, Jaksel</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Komposisi Gender
            </span>
            <span className="text-lg font-black font-mono text-teal-300 block mt-0.5">
              {totalCount > 0 ? `L ${pctLaki}% · P ${pctPerempuan}%` : '0% · 0%'}
            </span>
            <span className="text-[10px] text-slate-400">{totalCount > 0 ? 'Keseimbangan merata' : 'Menunggu input'}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Kelompok Usia Utama
            </span>
            <span className="text-lg font-black font-mono text-amber-300 block mt-0.5">
              {totalCount > 0 ? '17–35 th (61%)' : '0%'}
            </span>
            <span className="text-[10px] text-slate-400">{totalCount > 0 ? 'Pemilih muda dominan' : 'Menunggu input'}</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs: Data Voter vs Laporan Terintegrasi (Slide 10-13) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto text-xs font-bold no-scrollbar">
        <button
          onClick={() => setActiveSubTab('voters')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'voters'
              ? 'bg-white text-cyan-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-cyan-600" />
          <span>Daftar Data Voter ({filteredVoters.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rekap_tps')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'rekap_tps'
              ? 'bg-white text-cyan-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-teal-600" />
          <span>Laporan Voter per TPS</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quick_count_pemetaan')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'quick_count_pemetaan'
              ? 'bg-white text-cyan-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Hasil Quick Count Paslon</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rincian_ocr')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'rincian_ocr'
              ? 'bg-white text-cyan-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          <span>Rincian OCR Caleg</span>
        </button>
      </div>

      {/* SUB TAB 1: DAFTAR DATA VOTER (Slide 4 & 5) */}
      {activeSubTab === 'voters' && (
        <div className="space-y-4">
          {/* Breadcrumb Filter Bertingkat (Slide 4 & 5) */}
          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto pb-1">
              <span className="text-slate-900 font-bold">Wilayah Bertingkat:</span>
              <span className="text-cyan-700 font-bold">Provinsi (DKI Jakarta)</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-cyan-700 font-bold">Kota (Jakarta Selatan)</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-cyan-700 font-bold">Kecamatan (Cilandak)</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="bg-cyan-100 text-cyan-900 px-2 py-0.5 rounded-md font-mono font-bold">
                TPS 047 Sukamaju
              </span>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="⌕ Cari nama voter / NIK / TPS..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">Semua Status DPT</option>
                  <option value="valid">DPT Valid Saja</option>
                  <option value="perlu_cek">Perlu Cek</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedTps}
                  onChange={(e) => setSelectedTps(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden font-mono"
                >
                  <option value="Semua">Semua TPS</option>
                  <option value="TPS 047">TPS 047</option>
                  <option value="TPS 001">TPS 001</option>
                  <option value="TPS 002">TPS 002</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table / List Voters */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Daftar Voter Terdaftar ({filteredVoters.length} Orang)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Data hasil OCR KTP lapangan yang telah diverifikasi saksi dan kader TPS.
                </p>
              </div>

              {onOpenDaftarVoterModal && (
                <button
                  onClick={onOpenDaftarVoterModal}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>+ Tambah Voter Baru</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="py-3 px-4">Nama Voter</th>
                    <th className="py-3 px-4">NIK (Terverifikasi)</th>
                    <th className="py-3 px-4">Gender &amp; TTL</th>
                    <th className="py-3 px-4">Wilayah &amp; TPS</th>
                    <th className="py-3 px-4">Status DPT</th>
                    <th className="py-3 px-4">Status Master</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredVoters.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-4 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto">
                          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-800">Belum Ada Data Pemilih yang Diinput</p>
                            <p className="text-xs text-slate-400">
                              Data awal telah dibersihkan. Gunakan fitur Auto Scan e-KTP untuk mendaftarkan pemilih pertama Anda.
                            </p>
                          </div>
                          {onOpenDaftarVoterModal && (
                            <button
                              onClick={onOpenDaftarVoterModal}
                              className="mt-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <span>+ Scan e-KTP Pemilih Sekarang</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredVoters.map((voter) => (
                      <tr key={voter.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {voter.nama}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {voter.nikMasked}
                        </td>
                        <td className="py-3 px-4 text-[11px]">
                          <span className="font-semibold block">{voter.jenisKelamin}</span>
                          <span className="text-slate-400">{voter.tempatTglLahir}</span>
                        </td>
                        <td className="py-3 px-4 text-[11px]">
                          <span className="font-extrabold text-cyan-800 block">{voter.tps}</span>
                          <span className="text-slate-500">{voter.kelurahan}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              voter.statusDpt === 'DPT valid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-teal-50 text-teal-700 border border-teal-200'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{voter.statusDpt}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 bg-cyan-100 text-cyan-800 font-mono font-extrabold text-[10px] rounded-full border border-cyan-200">
                            TERDAFTAR
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: LAPORAN VOTER PER TPS (Slide 11) */}
      {activeSubTab === 'rekap_tps' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div>
            <span className="text-[10px] font-mono font-black text-cyan-600 uppercase tracking-widest">
              SLIDE 11 · LAPORAN TERINTEGRASI
            </span>
            <h3 className="text-base font-black text-slate-900 mt-0.5">
              Laporan Voter Terdaftar per TPS
            </h3>
            <p className="text-xs text-slate-500">
              Target pemilih, voter terdaftar, validasi DPT KPU, dan persentase capaian per TPS.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Wilayah</th>
                  <th className="py-3 px-4 font-mono text-center">Target</th>
                  <th className="py-3 px-4 font-mono text-center">Terdaftar</th>
                  <th className="py-3 px-4 font-mono text-center">DPT Valid</th>
                  <th className="py-3 px-4 text-center">Capaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {LAPORAN_VOTER_PER_TPS.map((row, idx) => {
                  const isTotal = row.wilayah.includes('TOTAL');
                  return (
                    <tr
                      key={idx}
                      className={isTotal ? 'bg-teal-50 font-black text-slate-900' : 'hover:bg-slate-50'}
                    >
                      <td className="py-3 px-4 font-bold">{row.wilayah}</td>
                      <td className="py-3 px-4 font-mono text-center">{row.target}</td>
                      <td className="py-3 px-4 font-mono text-center text-cyan-800 font-bold">
                        {row.terdaftar}
                      </td>
                      <td className="py-3 px-4 font-mono text-center text-emerald-700 font-bold">
                        {row.dptValid}
                      </td>
                      <td className="py-3 px-4 text-center font-extrabold text-teal-800">
                        {row.capaian}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 3: HASIL QUICK COUNT & PEMETAAN PASLON (Slide 12) */}
      {activeSubTab === 'quick_count_pemetaan' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div>
            <span className="text-[10px] font-mono font-black text-cyan-600 uppercase tracking-widest">
              SLIDE 12 · LAPORAN TERINTEGRASI
            </span>
            <h3 className="text-base font-black text-slate-900 mt-0.5">
              Hasil Quick Count &amp; Pemetaan Paslon
            </h3>
            <p className="text-xs text-slate-500">
              Perolehan suara berdasarkan formulir C1 Plano saksi TPS yang telah terverifikasi OCR.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Paslon</th>
                  <th className="py-3 px-4 font-mono text-center">Suara</th>
                  <th className="py-3 px-4 font-mono text-center">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {HASIL_QUICK_COUNT_PEMETAAN.map((p, idx) => (
                  <tr
                    key={idx}
                    className={p.isUtama ? 'bg-teal-50/80 font-bold text-teal-950' : 'hover:bg-slate-50'}
                  >
                    <td className="py-3 px-4 font-black flex items-center gap-2">
                      {p.isUtama && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                      <span>{p.paslon}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-center font-black">
                      {p.suara.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 font-mono text-center font-extrabold text-teal-800">
                      {p.persentase}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-black text-slate-900">
                  <td className="py-3 px-4">TOTAL SUARA SAH</td>
                  <td className="py-3 px-4 font-mono text-center">44.085</td>
                  <td className="py-3 px-4 font-mono text-center">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 4: RINCIAN OCR CALEG & PASLON LAIN (Slide 13) */}
      {activeSubTab === 'rincian_ocr' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div>
            <span className="text-[10px] font-mono font-black text-cyan-600 uppercase tracking-widest">
              SLIDE 13 · LAPORAN TERINTEGRASI
            </span>
            <h3 className="text-base font-black text-slate-900 mt-0.5">
              Rincian OCR • Caleg &amp; Paslon Lain
            </h3>
            <p className="text-xs text-slate-500">
              Rincian audit angka suara tiap kandidat kompetitor serta nomor urut partai.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama</th>
                  <th className="py-3 px-4 text-center">Partai / No.</th>
                  <th className="py-3 px-4 font-mono text-center">Suara</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {RINCIAN_OCR_CALEG_PASLON.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{c.nama}</td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                      {c.partaiNo}
                    </td>
                    <td className="py-3 px-4 font-mono text-center font-black text-slate-900">
                      {c.suara.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] rounded-full border border-emerald-300">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
