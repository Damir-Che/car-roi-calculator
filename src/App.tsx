import { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsPanel from './components/ResultsPanel';
import RevenueChart from './components/RevenueChart';
import { useCalculator } from './hooks/useCalculator';
import { generatePdf } from './utils/generatePdf';

export default function App() {
  const { inputs, results, updateField } = useCalculator();
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handleDownloadPdf() {
    setPdfLoading(true);
    try {
      await generatePdf(inputs, results);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold text-slate-800 text-sm">Car ROI Calculator</span>
          </div>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            {pdfLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Генерация…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Скачать PDF
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Калькулятор доходности автомобиля</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Рассчитайте ROI, срок окупаемости и чистую прибыль от сдачи автомобиля в аренду
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Left: input */}
          <div className="space-y-4">
            <InputForm inputs={inputs} onUpdate={updateField} />

            {/* Summary hint */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
              <span className="font-semibold">Совет:</span> введите реальные данные и отслеживайте,
              как меняются показатели в реальном времени.
            </div>
          </div>

          {/* Right: results */}
          <div className="space-y-4">
            <ResultsPanel results={results} inputs={inputs} />
            <RevenueChart results={results} inputs={inputs} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 mt-12 py-6 text-center text-xs text-slate-400">
        Car ROI Calculator · Все расчеты носят ориентировочный характер
      </footer>
    </div>
  );
}
