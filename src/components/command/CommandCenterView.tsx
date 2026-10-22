import React, { useState } from 'react';
import {
  AspirasiItem,
  FormC1Upload,
  FormB1Upload,
  DptVoterRecord,
  ElectabilitySurveySubmission,
  WhatsAppBlaztItem,
} from '../../types/vore';
import { CAMPAIGN_METRICS, INITIAL_B1_RECORDS } from '../../data/mockData';
import { INITIAL_ELECTABILITY_SURVEYS, INITIAL_DPT_RECORDS, INITIAL_BLAZT_ITEMS } from '../../data/dptData';
import { AutoCekNikModal } from '../common/AutoCekNikModal';
import { WhatsAppBlaztModal } from '../common/WhatsAppBlaztModal';
import { FormC1UploadModal } from '../common/FormC1UploadModal';
import { FormB1UploadModal } from '../common/FormB1UploadModal';
import { ElectabilitySurveyModal } from '../common/ElectabilitySurveyModal';
import { MonitoringPendukungModal } from '../common/MonitoringPendukungModal';
import { MonitoringPetaSuaraScreen } from '../mobile/screens/MonitoringPetaSuaraScreen';
import {
  Users,
  Award,
  MessageSquare,
  TrendingUp,
  FileCheck2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  Eye,
  Vote,
  Sparkles,
  BarChart2,
  CreditCard,
  MessageCircle,
  Camera,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Plus,
  ExternalLink,
  ShieldCheck,
  Calculator,
  UploadCloud,
  Building2,
  FileText,
  FileCheck,
  X,
  Shirt,
  Package,
  Printer,
  PieChart,
  Wifi,
  WifiOff,
  HeartHandshake,
  Compass,
} from 'lucide-react';

interface CommandCenterViewProps {
  aspirasiList: AspirasiItem[];
  c1Records: FormC1Upload[];
  b1Records?: FormB1Upload[];
  onUpdateAspirasiStatus: (
    id: string,
    status: 'Masuk' | 'Diproses' | 'Selesai',
    tanggapan: string,
    progresPersen: number
  ) => void;
  surveyList?: ElectabilitySurveySubmission[];
  dptList?: DptVoterRecord[];
  onAddDptVoter?: (voter: DptVoterRecord) => void;
  blaztLogs?: WhatsAppBlaztItem[];
  onTriggerBlazt?: (campaign: { target: string; totalTarget: number; pesan: string }) => void;
  onSubmitC1?: (c1Data: Partial<FormC1Upload>) => void;
  onSubmitB1?: (b1Data: Partial<FormB1Upload>) => void;
  onSubmitSurvey?: (submission: ElectabilitySurveySubmission, points: number) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  aspirasiList,
  c1Records,
  b1Records = INITIAL_B1_RECORDS,
  onUpdateAspirasiStatus,
  surveyList = INITIAL_ELECTABILITY_SURVEYS,
  dptList = INITIAL_DPT_RECORDS,
  onAddDptVoter,
  blaztLogs = INITIAL_BLAZT_ITEMS,
  onTriggerBlazt,
  onSubmitC1,
  onSubmitB1,
  onSubmitSurvey,
}) => {
  const [activeTab, setActiveTab] = useState<
    'quick_count' | 'peta_suara' | 'dpt' | 'blazt' | 'aspirasi' | 'demografi' | 'survei'
  >('quick_count');

  // Quick Count sub filter
  const [quickCountSubFilter, setQuickCountSubFilter] = useState<'all' | 'c1' | 'b1'>('all');

  const [selectedAspirasi, setSelectedAspirasi] = useState<AspirasiItem | null>(
    aspirasiList[0] || null
  );
  const [tanggapanInput, setTanggapanInput] = useState('');
  const [statusSelect, setStatusSelect] = useState<'Masuk' | 'Diproses' | 'Selesai'>('Diproses');
  const [progressInput, setProgressInput] = useState(70);

  // Modals state
  const [showCekNikModal, setShowCekNikModal] = useState(false);
  const [showBlaztModal, setShowBlaztModal] = useState(false);
  const [showC1Modal, setShowC1Modal] = useState(false);
  const [showB1Modal, setShowB1Modal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    url?: string;
    fileName?: string;
    info?: string;
  } | null>(null);

  // Quick Count calculation directly from uploaded Form C1 (TPS) and Form B1 (Kecamatan / PPK)
  const c1P1 = c1Records.reduce((acc, c) => acc + c.suaraPaslon1, 0);
  const c1P2 = c1Records.reduce((acc, c) => acc + c.suaraPaslon2, 0);
  const c1P3 = c1Records.reduce((acc, c) => acc + c.suaraPaslon3, 0);
  const c1TidakSah = c1Records.reduce((acc, c) => acc + c.suaraTidakSah, 0);

  const b1P1 = b1Records.reduce((acc, b) => acc + b.suaraPaslon1, 0);
  const b1P2 = b1Records.reduce((acc, b) => acc + b.suaraPaslon2, 0);
  const b1P3 = b1Records.reduce((acc, b) => acc + b.suaraPaslon3, 0);
  const b1TidakSah = b1Records.reduce((acc, b) => acc + b.suaraTidakSah, 0);

  // Total Aggregation
  const totalPaslon1 = c1P1 + b1P1;
  const totalPaslon2 = c1P2 + b1P2;
  const totalPaslon3 = c1P3 + b1P3;
  const grandTotalTidakSah = c1TidakSah + b1TidakSah;
  const grandTotalSah = totalPaslon1 + totalPaslon2 + totalPaslon3;
  const grandTotalMasuk = grandTotalSah + grandTotalTidakSah || 1;

  const pctPaslon1 = grandTotalSah > 0 ? ((totalPaslon1 / grandTotalSah) * 100).toFixed(1) : '0.0';
  const pctPaslon2 = grandTotalSah > 0 ? ((totalPaslon2 / grandTotalSah) * 100).toFixed(1) : '0.0';
  const pctPaslon3 = grandTotalSah > 0 ? ((totalPaslon3 / grandTotalSah) * 100).toFixed(1) : '0.0';

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAspirasi) return;
    onUpdateAspirasiStatus(
      selectedAspirasi.id,
      statusSelect,
      tanggapanInput ||
        selectedAspirasi.tanggapanResmi?.pesan ||
        'Aspirasi telah ditindaklanjuti oleh tim kerja SWARAKU.',
      progressInput
    );
    alert(`Status aspirasi "${selectedAspirasi.judul}" berhasil diperbarui ke "${statusSelect}"!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-sky-50 via-cyan-50 to-white text-slate-900 rounded-3xl border border-cyan-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 border border-cyan-200 rounded-full text-xs font-bold text-cyan-800 mb-2">
            <span>PLATFORM PEMENANGAN TERPADU</span>
            <span>·</span>
            <span>COMMAND CENTER &amp; ANALISIS</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            SWARAKU Central Command: Partai, Caleg &amp; Capres
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Sistem pemenangan pemilu digital: tabulasi Quick Count otomatis berbasis Form C1 &amp; Form B1, auto cek NIK KTP DPT KPU, dan broadcast WhatsApp Blazt langsung terhubung.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => setShowC1Modal(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>+ Unggah Form C1</span>
          </button>

          <button
            onClick={() => setShowB1Modal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>+ Unggah Form B1</span>
          </button>
        </div>
      </div>

      {/* Top High-Level Metrics (4 Key Stats) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Suara Masuk Quick Count
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-cyan-700 font-mono">
              {grandTotalMasuk.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-500">Suara</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
            {c1Records.length} TPS · {b1Records.length} Kecamatan
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Perolehan Paslon 01
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-emerald-600 font-mono">
              {pctPaslon1}%
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({totalPaslon1.toLocaleString('id-ID')} Suara)
            </span>
          </div>
          <span className="text-[10px] text-cyan-600 font-bold mt-1 block">
            Unggul di Wilayah Dapil
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Aspirasi Selesai
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {aspirasiList.length > 0
                ? ((aspirasiList.filter((a) => a.status === 'Selesai').length / aspirasiList.length) * 100).toFixed(0)
                : '0'}%
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
            {aspirasiList.length > 0 ? 'Respons Cepat' : 'Menunggu Input'}
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Pendukung DPT Terdata
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-emerald-600 font-mono">
              {dptList.length.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-500">Warga</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            Sinkron DPT KPU
          </span>
        </div>
      </div>

      {/* Tabs Selection */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('quick_count')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'quick_count'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Quick Count (Form C1 &amp; Form B1)</span>
        </button>

        <button
          onClick={() => setActiveTab('peta_suara')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'peta_suara'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Monitoring Peta Suara</span>
        </button>

        <button
          onClick={() => setActiveTab('dpt')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'dpt'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Auto Cek NIK &amp; DPT ({dptList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blazt')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'blazt'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp Blazt ({blaztLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('aspirasi')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'aspirasi'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Aspirasi Warga ({aspirasiList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('demografi')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'demografi'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Monitoring Pendukung &amp; Logistik</span>
        </button>

        <button
          onClick={() => setActiveTab('survei')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'survei'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Vote className="w-3.5 h-3.5" />
          <span>Survei Online ({surveyList.length})</span>
        </button>
      </div>

      {/* Tab 1: QUICK COUNT BERDASARKAN FORM C1 & B1 HASIL INPUT DARI APLIKASI */}
      {activeTab === 'quick_count' && (
        <div className="space-y-6">
          {/* Main Quick Count Tally Banner */}
          <div className="p-6 bg-gradient-to-br from-white via-cyan-50/50 to-slate-50 text-slate-900 rounded-3xl border border-cyan-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider block">
                  Quick Count Pemilu Terpadu · Berdasarkan Unggah Form C1 &amp; Form B1
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Hasil Perhitungan Suara Real-Time dari Aplikasi Terhubung
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rekapitulasi otomatis gabungan dari laporan saksi di TPS (Form C1 Plano) dan koordinator kecamatan (Form Model B1-KWK).
                </p>
              </div>

              <div className="text-right flex items-center gap-3">
                <div className="p-3 bg-white rounded-2xl border border-cyan-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">
                    Laporan Masuk
                  </span>
                  <span className="text-lg font-black font-mono text-cyan-800">
                    {c1Records.length} C1 (TPS) · {b1Records.length} B1 (PPK)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Count Bars */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-bold">
                  <span className="text-cyan-900">01. Paslon 01 (Kandidat Utama)</span>
                  <span className="font-mono text-cyan-700">
                    {pctPaslon1}% ({totalPaslon1.toLocaleString('id-ID')} Suara)
                  </span>
                </div>
                <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full transition-all duration-700"
                    style={{ width: `${pctPaslon1}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-bold">
                  <span className="text-amber-800">02. Paslon 02</span>
                  <span className="font-mono text-slate-700">
                    {pctPaslon2}% ({totalPaslon2.toLocaleString('id-ID')} Suara)
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${pctPaslon2}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-bold">
                  <span className="text-rose-800">03. Paslon 03</span>
                  <span className="font-mono text-slate-700">
                    {pctPaslon3}% ({totalPaslon3.toLocaleString('id-ID')} Suara)
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-700"
                    style={{ width: `${pctPaslon3}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Count Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-200 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Total Suara Sah:</span>
                <span className="text-sm font-extrabold font-mono text-slate-900">
                  {grandTotalSah.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Suara Tidak Sah:</span>
                <span className="text-sm font-extrabold font-mono text-rose-700">
                  {grandTotalTidakSah.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Total Suara Terhimpun:</span>
                <span className="text-sm font-extrabold font-mono text-cyan-800">
                  {grandTotalMasuk.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Status Tabulasi:</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Real-Time Sync</span>
                </span>
              </div>
            </div>
          </div>

          {/* Sub Filters & Table Selection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Log Dokumen Masuk Quick Count (Form C1 &amp; Form B1)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verifikasi lembar plano TPS &amp; rekapitulasi PPK kecamatan beserta lampiran dokumen/fotonya
                </p>
              </div>

              {/* Filter Sub-Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQuickCountSubFilter('all')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    quickCountSubFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({c1Records.length + b1Records.length})
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCountSubFilter('c1')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    quickCountSubFilter === 'c1'
                      ? 'bg-cyan-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Form C1 TPS ({c1Records.length})
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCountSubFilter('b1')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    quickCountSubFilter === 'b1'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Form B1 Kecamatan ({b1Records.length})
                </button>
              </div>
            </div>

            {/* Tables based on filter */}
            <div className="space-y-6">
              {/* Form C1 Table */}
              {(quickCountSubFilter === 'all' || quickCountSubFilter === 'c1') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-900">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-600" />
                      <span>Rekapitulasi Form C1 Plano (Tingkat TPS)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowC1Modal(true)}
                      className="text-[11px] font-bold text-cyan-700 hover:underline cursor-pointer"
                    >
                      + Unggah Form C1 Baru
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <tr>
                          <th className="p-3">TPS &amp; Wilayah</th>
                          <th className="p-3">Saksi Pelapor</th>
                          <th className="p-3 text-center">Paslon 01</th>
                          <th className="p-3 text-center">Paslon 02</th>
                          <th className="p-3 text-center">Paslon 03</th>
                          <th className="p-3 text-center">Tidak Sah</th>
                          <th className="p-3 text-center">Total Sah</th>
                          <th className="p-3 text-center">Dokumen / Foto</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {c1Records.map((c) => (
                          <tr key={c.id} className="hover:bg-cyan-50/40">
                            <td className="p-3">
                              <span className="font-extrabold text-cyan-800 block">{c.tps}</span>
                              <span className="text-[10px] text-slate-500">
                                {c.kelurahan}, {c.kecamatan}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-slate-900 block">{c.saksiNama}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{c.waktuUpload}</span>
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-emerald-700 bg-emerald-50/50">
                              {c.suaraPaslon1}
                            </td>
                            <td className="p-3 text-center font-mono text-slate-700">{c.suaraPaslon2}</td>
                            <td className="p-3 text-center font-mono text-slate-700">{c.suaraPaslon3}</td>
                            <td className="p-3 text-center font-mono text-rose-700">{c.suaraTidakSah}</td>
                            <td className="p-3 text-center font-mono font-bold text-slate-900">
                              {c.totalSuaraSah}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewDoc({
                                    title: `Formulir C1 Plano ${c.tps} (${c.kelurahan})`,
                                    url: c.fotoC1Url,
                                    fileName: c.fileName || 'Form-C1-Plano.jpg',
                                    info: `Pelapor: ${c.saksiNama} · Waktu: ${c.waktuUpload} · Sah: ${c.totalSuaraSah}`,
                                  })
                                }
                                className="px-2 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-[11px] font-bold rounded-lg border border-cyan-200 inline-flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3 h-3 text-cyan-600" />
                                <span>Lihat File</span>
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {c.statusVerifikasi}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Form B1 Table */}
              {(quickCountSubFilter === 'all' || quickCountSubFilter === 'b1') && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <span>Rekapitulasi Form Model B1-KWK (Tingkat Kecamatan / PPK)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowB1Modal(true)}
                      className="text-[11px] font-bold text-indigo-700 hover:underline cursor-pointer"
                    >
                      + Unggah Form B1 Baru
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <tr>
                          <th className="p-3">Kecamatan &amp; Dapil</th>
                          <th className="p-3">Koordinator PPK / Saksi</th>
                          <th className="p-3 text-center">Cakupan TPS</th>
                          <th className="p-3 text-center">Paslon 01</th>
                          <th className="p-3 text-center">Paslon 02</th>
                          <th className="p-3 text-center">Paslon 03</th>
                          <th className="p-3 text-center">Tidak Sah</th>
                          <th className="p-3 text-center">Total Sah</th>
                          <th className="p-3 text-center">Dokumen / Scan B1</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {b1Records.map((b) => (
                          <tr key={b.id} className="hover:bg-indigo-50/40">
                            <td className="p-3">
                              <span className="font-extrabold text-indigo-900 block">{b.kecamatan}</span>
                              <span className="text-[10px] text-slate-500">{b.kelurahan}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-slate-900 block">{b.koordinatorNama}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{b.waktuUpload}</span>
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-slate-700">
                              {b.totalTpsTercakup} TPS
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-emerald-700 bg-emerald-50/50">
                              {b.suaraPaslon1.toLocaleString('id-ID')}
                            </td>
                            <td className="p-3 text-center font-mono text-slate-700">
                              {b.suaraPaslon2.toLocaleString('id-ID')}
                            </td>
                            <td className="p-3 text-center font-mono text-slate-700">
                              {b.suaraPaslon3.toLocaleString('id-ID')}
                            </td>
                            <td className="p-3 text-center font-mono text-rose-700">
                              {b.suaraTidakSah.toLocaleString('id-ID')}
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-slate-900">
                              {b.totalSuaraSah.toLocaleString('id-ID')}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewDoc({
                                    title: `Formulir Model B1-KWK ${b.kecamatan}`,
                                    url: b.fotoB1Url,
                                    fileName: b.fileName || 'Form-Model-B1-Kecamatan.jpg',
                                    info: `Koordinator: ${b.koordinatorNama} · Cakupan: ${b.totalTpsTercakup} TPS · Sah: ${b.totalSuaraSah.toLocaleString('id-ID')}`,
                                  })
                                }
                                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-bold rounded-lg border border-indigo-200 inline-flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3 h-3 text-indigo-600" />
                                <span>Lihat Scan B1</span>
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                                {b.statusVerifikasi}
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
          </div>
        </div>
      )}

      {/* Tab: MONITORING PETA SUARA DAPIL (Kab, Kec, Desa, TPS) */}
      {activeTab === 'peta_suara' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <MonitoringPetaSuaraScreen
            dptList={dptList}
            onOpenWhatsAppBlazt={() => setShowBlaztModal(true)}
          />
        </div>
      )}

      {/* Tab 2: Auto Cek NIK & Basis Data DPT KPU */}
      {activeTab === 'dpt' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-3xl border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Database Pemilih Tetap (DPT) KPU
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Pencarian &amp; Verifikasi Cepat NIK KTP
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Cukup input 16 digit NIK, sistem otomatis menarik No. TPS, kelurahan, dan data pendukung.
              </p>
            </div>
            <button
              onClick={() => setShowCekNikModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Buka Formulir Auto Cek NIK</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Daftar Pendukung Terverifikasi DPT KPU ({dptList.length})
              </h3>
              <span className="text-xs text-emerald-700 font-bold">100% Sinkron DPT KPU</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-2">NIK</th>
                    <th className="pb-2">Nama Lengkap</th>
                    <th className="pb-2">TPS &amp; Kelurahan</th>
                    <th className="pb-2">Usia / JK</th>
                    <th className="pb-2">Dapil</th>
                    <th className="pb-2">Status Pendukung</th>
                    <th className="pb-2 text-center">Status DPT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dptList.map((d) => (
                    <tr key={d.nik} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-slate-800">{d.nik}</td>
                      <td className="py-3 font-bold text-slate-900">{d.nama}</td>
                      <td className="py-3">
                        <span className="font-bold text-cyan-700 block">{d.tps}</span>
                        <span className="text-[10px] text-slate-500">{d.kelurahan}, {d.kecamatan}</span>
                      </td>
                      <td className="py-3 text-slate-600">{d.usia} thn ({d.jenisKelamin})</td>
                      <td className="py-3 text-slate-600">{d.dapil}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                          {d.statusPendukung}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {d.statusDpt}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: WhatsApp Blazt */}
      {activeTab === 'blazt' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-white rounded-3xl border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Broadcast &amp; Engagement Pendukung
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                WhatsApp Blazt Massal &amp; Direct Connection
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Kirim pesan langsung ke nomor telepon pendukung, saksi, dan relawan secara serempak.
              </p>
            </div>
            <button
              onClick={() => setShowBlaztModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Buka Menu WhatsApp Blazt</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Log Histori WhatsApp Blazt Terkirim ({blaztLogs.length})
              </h3>
              <span className="text-xs text-slate-500 font-mono">Live Broadcast Server</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-2">Penerima / Target</th>
                    <th className="pb-2">Nomor HP / Saluran</th>
                    <th className="pb-2">TPS / Wilayah</th>
                    <th className="pb-2">Isi Ringkasan Pesan</th>
                    <th className="pb-2">Waktu</th>
                    <th className="pb-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blaztLogs.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900">{b.namaPenerima}</td>
                      <td className="py-3 font-mono text-slate-600">{b.noHp}</td>
                      <td className="py-3 font-mono font-bold text-cyan-800">{b.tps}</td>
                      <td className="py-3 text-slate-600 max-w-sm truncate">{b.pesanPreview}</td>
                      <td className="py-3 text-slate-500 font-mono">{b.waktu}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Aspirasi Warga */}
      {activeTab === 'aspirasi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  Semua Aspirasi Warga Masuk ({aspirasiList.length})
                </h3>
              </div>

              <div className="space-y-3">
                {aspirasiList.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
                    <p className="text-sm font-bold text-slate-700">Belum Ada Aspirasi Masuk</p>
                    <p className="text-xs text-slate-400">Data aspirasi awal telah dibersihkan. Aspirasi baru dari warga akan tampil di sini secara real-time.</p>
                  </div>
                ) : (
                  aspirasiList.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setSelectedAspirasi(a);
                        setStatusSelect(a.status);
                        setProgressInput(a.tanggapanResmi?.progresPersen || 40);
                        setTanggapanInput(a.tanggapanResmi?.pesan || '');
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedAspirasi?.id === a.id
                          ? 'border-cyan-500 bg-cyan-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {a.kategori}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                a.status === 'Selesai'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : a.status === 'Diproses'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {a.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{a.judul}</h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{a.deskripsi}</p>
                        </div>
                        <span className="text-xs font-bold text-cyan-700 font-mono whitespace-nowrap">
                          👍 {a.upvotes}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Action Desk */}
          <div>
            {selectedAspirasi ? (
              <form
                onSubmit={handleUpdate}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 sticky top-20 text-xs"
              >
                <div className="pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-cyan-600 uppercase">
                    Respon &amp; Tindak Lanjut
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                    {selectedAspirasi.judul}
                  </h4>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Aspirasi:</label>
                  <select
                    value={statusSelect}
                    onChange={(e) => setStatusSelect(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Masuk">Masuk (Verifikasi Awal)</option>
                    <option value="Diproses">Diproses (Koordinasi Dinas/Tim)</option>
                    <option value="Selesai">Selesai (Tuntas Diakomodasi)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Progres Penyelesaian: {progressInput}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressInput}
                    onChange={(e) => setProgressInput(Number(e.target.value))}
                    className="w-full accent-cyan-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tanggapan Resmi untuk Warga:
                  </label>
                  <textarea
                    rows={4}
                    value={tanggapanInput}
                    onChange={(e) => setTanggapanInput(e.target.value)}
                    placeholder="Tuliskan tindakan konkret yang telah dilakukan..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Publikasikan Tanggapan
                </button>
              </form>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
                Pilih aspirasi warga untuk memberikan respon.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Monitoring Pendukung & Logistik (Umur & Gender HD) */}
      {activeTab === 'demografi' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl border border-indigo-700/50 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-bold text-indigo-200 mb-2">
                  <Package className="w-3.5 h-3.5 text-cyan-300" />
                  <span>MODUL PEMETAAN DEMOGRAFI &amp; ALOKASI LOGISTIK</span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Monitoring Pendukung &amp; Kesiapan Logistik
                </h3>
                <p className="text-xs text-indigo-200/90 max-w-2xl mt-1 leading-relaxed">
                  Fungsi akumulasi jumlah pendukung terdata, pemetaan proporsional berdasarkan kelompok Umur dan Jenis Kelamin guna ketepatan persiapan &amp; distribusi logistik pemenangan.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowMonitoringModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Package className="w-4 h-4" />
                  <span>Buka Panel Simulator TPS</span>
                </button>
              </div>
            </div>

            {/* 4 Akumulasi Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block">
                  Total Pendukung Terdata
                </span>
                <span className="text-2xl font-black font-mono text-white mt-1 block">
                  {(14850 + dptList.length).toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  +{dptList.length} dari e-KTP baru
                </span>
              </div>

              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block">
                  Target Kemenangan
                </span>
                <span className="text-2xl font-black font-mono text-white mt-1 block">
                  20.000
                </span>
                <span className="text-[10px] text-cyan-300 font-bold">
                  {(((14850 + dptList.length) / 20000) * 100).toFixed(1)}% tercapai
                </span>
              </div>

              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block">
                  Pendukung Pria
                </span>
                <span className="text-2xl font-black font-mono text-cyan-300 mt-1 block">
                  {Math.round((14850 + dptList.length) * 0.486).toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-slate-300 font-mono">48.6% Total</span>
              </div>

              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block">
                  Pendukung Wanita
                </span>
                <span className="text-2xl font-black font-mono text-rose-300 mt-1 block">
                  {Math.round((14850 + dptList.length) * 0.514).toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-slate-300 font-mono">51.4% Total</span>
              </div>
            </div>
          </div>

          {/* Pemetaan Kelompok Umur & Jenis Kelamin Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Age Demographics */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-cyan-600" />
                  <span>Pemetaan Berdasarkan Kelompok Umur</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">4 Kategori Usia</span>
              </div>

              <div className="space-y-3">
                {/* Gen Z */}
                <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-cyan-950 font-black">Gen Z (17 - 27 Tahun) · 32%</span>
                    <span className="font-mono text-cyan-800 font-black">
                      {Math.round((14850 + dptList.length) * 0.32).toLocaleString('id-ID')} Jiwa
                    </span>
                  </div>
                  <div className="w-full bg-cyan-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-cyan-600 h-full rounded-full" style={{ width: '32%' }}></div>
                  </div>
                  <span className="text-[11px] text-slate-600 block">
                    <strong>Kebutuhan Logistik:</strong> Kaos model slim-fit, tote bag canvas, topi bucket, tumbler stainless, stiker hologram.
                  </span>
                </div>

                {/* Milenial */}
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-indigo-950 font-black">Milenial (28 - 43 Tahun) · 38%</span>
                    <span className="font-mono text-indigo-800 font-black">
                      {Math.round((14850 + dptList.length) * 0.38).toLocaleString('id-ID')} Jiwa
                    </span>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '38%' }}></div>
                  </div>
                  <span className="text-[11px] text-slate-600 block">
                    <strong>Kebutuhan Logistik:</strong> Kaos polo kerah, rompi relawan, kalender saku, flyer program kerja ekonomi/UMKM.
                  </span>
                </div>

                {/* Gen X */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-amber-950 font-black">Gen X (44 - 59 Tahun) · 21%</span>
                    <span className="font-mono text-amber-800 font-black">
                      {Math.round((14850 + dptList.length) * 0.21).toLocaleString('id-ID')} Jiwa
                    </span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: '21%' }}></div>
                  </div>
                  <span className="text-[11px] text-slate-600 block">
                    <strong>Kebutuhan Logistik:</strong> Kaos katun ukuran L &amp; XL, payung lipat, mug keramik, kalender dinding.
                  </span>
                </div>

                {/* Baby Boomer / Lansia */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-emerald-950 font-black">Baby Boomer &amp; Lansia (60+ Tahun) · 9%</span>
                    <span className="font-mono text-emerald-800 font-black">
                      {Math.round((14850 + dptList.length) * 0.09).toLocaleString('id-ID')} Jiwa
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '9%' }}></div>
                  </div>
                  <span className="text-[11px] text-slate-600 block">
                    <strong>Kebutuhan Logistik:</strong> Paket sembako peduli lansia, sarung, obat herbal/tensi, armada jemputan TPS.
                  </span>
                </div>
              </div>
            </div>

            {/* Logistics Status & Preparation Table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-teal-600" />
                  <span>Kesiapan Gudang Logistik Kampanye</span>
                </h4>
                <button
                  onClick={() => alert('📄 Form Pengajuan Logistik Tambahan (SPPL) telah dicetak!')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <Printer className="w-3 h-3 text-cyan-600" />
                  <span>Cetak SPPL</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {/* Kaos */}
                <div className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-slate-800">
                      <Shirt className="w-4 h-4 text-cyan-600" />
                      <span>Kaos Kampanye (S, M, L, XL, XXL)</span>
                    </span>
                    <span className="font-mono">12.000 / {(14850 + dptList.length).toLocaleString('id-ID')} Pcs</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-cyan-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, (12000 / (14850 + dptList.length)) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-amber-700 font-bold block">
                    Defisit {(Math.max(0, 14850 + dptList.length - 12000)).toLocaleString('id-ID')} Pcs · Perlu PO Tambahan
                  </span>
                </div>

                {/* Jilbab */}
                <div className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-slate-800">
                      <span className="text-sm">🧕</span>
                      <span>Jilbab &amp; Kerudung Seragam Relawati</span>
                    </span>
                    <span className="font-mono">8.000 / {Math.round((14850 + dptList.length) * 0.514).toLocaleString('id-ID')} Pcs</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    Stok Aman (100% Siap Distribusi ke Kelurahan)
                  </span>
                </div>

                {/* Rompi */}
                <div className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-slate-800">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>Rompi Lapangan Relawan &amp; Saksi TPS</span>
                    </span>
                    <span className="font-mono">450 / 420 Pcs</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    Stok Lengkap (Alokasi 2 Saksi + 2 Relawan per TPS)
                  </span>
                </div>

                {/* Sembako */}
                <div className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-slate-800">
                      <HeartHandshake className="w-4 h-4 text-emerald-600" />
                      <span>Paket Sembako Pasar Murah / Bantuan Warga</span>
                    </span>
                    <span className="font-mono">3.000 / 3.500 Paket</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-[10px] text-amber-700 font-bold block">
                    Defisit 500 Paket untuk Prioritas Lansia RW 04 &amp; RW 07
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowMonitoringModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Buka Simulator Alokasi Logistik Per TPS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Survei Offline & Online Elektabilitas */}
      {activeTab === 'survei' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-teal-800 via-cyan-800 to-slate-900 text-white rounded-3xl border border-teal-700/50 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-xs font-bold text-teal-200 mb-2">
                  <Vote className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SISTEM SURVEI ELEKTABILITAS LAPANGAN</span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Survei Elektabilitas Paslon (SURVEI OFFLINE &amp; ONLINE)
                </h3>
                <p className="text-xs text-teal-100/90 max-w-2xl mt-1 leading-relaxed">
                  Sistem survei yang memudahkan anda mengukur elektabilitas kandidat secara online maupun offline di lapangan tanpa kendala koneksi internet.
                </p>
              </div>

              <button
                onClick={() => setShowSurveyModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Input Survei Lapangan Baru</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-teal-200 uppercase tracking-wider block">
                  Total Responden
                </span>
                <span className="text-2xl font-black font-mono text-white mt-1 block">
                  {surveyList.length} Responden
                </span>
                <span className="text-[10px] text-teal-300">Tercatat di Basis Data</span>
              </div>

              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-teal-200 uppercase tracking-wider block">
                  Elektabilitas Paslon 01
                </span>
                <span className="text-2xl font-black font-mono text-emerald-300 mt-1 block">
                  {surveyList.length > 0
                    ? ((surveyList.filter((s) => s.pilihanKandidat === 'Paslon 01 (Kandidat Utama)').length / surveyList.length) * 100).toFixed(1)
                    : '0'}%
                </span>
                <span className="text-[10px] text-emerald-300 font-bold">Kandidat Utama</span>
              </div>

              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-teal-200 uppercase tracking-wider block">
                  Pemilih Militan
                </span>
                <span className="text-2xl font-black font-mono text-white mt-1 block">
                  {surveyList.filter((s) => s.tingkatKemantapan === 'Sangat Mantap').length}
                </span>
                <span className="text-[10px] text-slate-300">Sangat Mantap</span>
              </div>

              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-teal-200 uppercase tracking-wider block">
                  Swing Voter
                </span>
                <span className="text-2xl font-black font-mono text-amber-300 mt-1 block">
                  {surveyList.filter((s) => s.tingkatKemantapan === 'Masih Ragu / Bisa Berubah').length}
                </span>
                <span className="text-[10px] text-amber-300">Target Follow-Up</span>
              </div>
            </div>
          </div>

          {/* List of Surveys */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-black text-sm text-slate-900">
                Log Rekap Responden Survei Elektabilitas:
              </h4>
              <button
                onClick={() => setShowSurveyModal(true)}
                className="px-3 py-1.5 bg-cyan-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Vote className="w-3.5 h-3.5" />
                <span>Buka Panel Tabulasi Lengkap</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {surveyList.map((s) => (
                <div key={s.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{s.voterNama}</span>
                      <span className="text-[10px] font-mono text-slate-400">{s.voterNikMasked}</span>
                      <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full font-bold">
                        {s.tps} · {s.kelurahan}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Pilihan: <strong>{s.pilihanKandidat}</strong> · Kemantapan: <span className="text-cyan-700 font-bold">{s.tingkatKemantapan}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {s.statusSinkron}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">{s.waktu}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Document/Photo Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{previewDoc.title}</h4>
                {previewDoc.info && (
                  <p className="text-[10px] text-slate-500 mt-0.5">{previewDoc.info}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 max-h-96 flex items-center justify-center">
              {previewDoc.url ? (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  className="w-full h-full object-contain max-h-96"
                />
              ) : (
                <div className="p-12 text-center space-y-2">
                  <FileText className="w-12 h-12 text-cyan-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">{previewDoc.fileName}</p>
                  <span className="text-[10px] text-slate-500">Dokumen Rekapitulasi Terverifikasi</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Cek NIK Modal */}
      <AutoCekNikModal
        isOpen={showCekNikModal}
        onClose={() => setShowCekNikModal(false)}
        onSaveVoter={(voter) => {
          if (onAddDptVoter) onAddDptVoter(voter);
        }}
      />

      {/* WhatsApp Blazt Modal */}
      <WhatsAppBlaztModal
        isOpen={showBlaztModal}
        onClose={() => setShowBlaztModal(false)}
        blaztLogs={blaztLogs}
        onTriggerBlazt={(campaign) => {
          if (onTriggerBlazt) onTriggerBlazt(campaign);
        }}
      />

      {/* Form C1 Upload Modal with Real File Upload */}
      <FormC1UploadModal
        isOpen={showC1Modal}
        onClose={() => setShowC1Modal(false)}
        onSubmitC1={(data) => {
          if (onSubmitC1) onSubmitC1(data);
        }}
      />

      {/* Form B1 Upload Modal with Real File Upload */}
      <FormB1UploadModal
        isOpen={showB1Modal}
        onClose={() => setShowB1Modal(false)}
        onSubmitB1={(data) => {
          if (onSubmitB1) onSubmitB1(data);
        }}
      />

      {/* Survei Elektabilitas & Survei Offline Modal */}
      <ElectabilitySurveyModal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        surveyList={surveyList}
        onSubmitSurvey={(s, p) => {
          if (onSubmitSurvey) onSubmitSurvey(s, p);
        }}
      />

      {/* Monitoring Pendukung & Kesiapan Logistik Modal */}
      <MonitoringPendukungModal
        isOpen={showMonitoringModal}
        onClose={() => setShowMonitoringModal(false)}
        dptList={dptList}
        onOpenAutoCekNik={() => {
          setShowMonitoringModal(false);
          setShowCekNikModal(true);
        }}
      />
    </div>
  );
};
