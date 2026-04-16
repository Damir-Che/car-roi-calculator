import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { CarInputs, CalcResults } from '../types';
import { formatCurrency, formatPercent, formatMonths } from './format';

function buildReportHtml(inputs: CarInputs, results: CalcResults): string {
  const date = new Date().toLocaleDateString('ru-RU');
  const paybackStr =
    results.paybackMonths !== null ? formatMonths(results.paybackMonths) : '—';
  const roiStr =
    results.annualROI !== null ? formatPercent(results.annualROI) : '—';
  const profitColor = results.netProfit >= 0 ? '#10b981' : '#ef4444';

  return `
    <div id="pdf-report" style="
      width: 680px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #fff;
      padding: 40px;
      box-sizing: border-box;
      color: #1e293b;
    ">
      <!-- Header -->
      <div style="background:#2563eb;border-radius:12px;padding:28px 32px;margin-bottom:28px;">
        <div style="font-size:22px;font-weight:700;color:#fff;margin-bottom:6px;">Car ROI Calculator</div>
        <div style="font-size:13px;color:#bfdbfe;">Отчёт о доходности инвестиции в автомобиль</div>
        <div style="font-size:12px;color:#93c5fd;margin-top:4px;">Дата: ${date}</div>
      </div>

      <!-- Inputs -->
      <div style="margin-bottom:24px;">
        <div style="font-size:14px;font-weight:700;margin-bottom:10px;color:#1e293b;">Входные данные</div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
          ${[
            ['Стоимость автомобиля', formatCurrency(inputs.carPrice)],
            ['Цена аренды в день', formatCurrency(inputs.dailyRate)],
            [`Дней аренды в месяц`, `${inputs.rentalDaysPerMonth} дн.`],
            ['Комиссия компании', formatPercent(inputs.commissionPercent)],
            ['Ежемесячные расходы', formatCurrency(inputs.monthlyExpenses)],
          ]
            .map(
              ([label, value], i) => `
            <div style="
              display:flex;justify-content:space-between;align-items:center;
              padding:10px 16px;
              background:${i % 2 === 0 ? '#f8fafc' : '#fff'};
              font-size:13px;
            ">
              <span style="color:#64748b;">${label}</span>
              <span style="font-weight:600;color:#1e293b;">${value}</span>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>

      <!-- KPI cards -->
      <div style="margin-bottom:24px;">
        <div style="font-size:14px;font-weight:700;margin-bottom:10px;color:#1e293b;">Результаты расчёта</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          ${[
            { label: 'Чистая прибыль / мес', value: formatCurrency(results.netProfit), bg: results.isViable ? '#2563eb' : '#fef2f2', color: results.isViable ? '#fff' : '#ef4444', sub: '' },
            { label: 'Годовой ROI', value: roiStr, bg: results.isViable ? '#2563eb' : '#fef2f2', color: results.isViable ? '#fff' : '#ef4444', sub: '' },
            { label: 'Срок окупаемости', value: paybackStr, bg: '#f8fafc', color: '#1e293b', sub: results.paybackYears !== null ? `≈ ${results.paybackYears.toFixed(1)} лет` : '' },
            { label: 'Оборот в месяц', value: formatCurrency(results.monthlyRevenue), bg: '#f8fafc', color: '#1e293b', sub: '' },
          ]
            .map(
              (kpi) => `
            <div style="background:${kpi.bg};border-radius:10px;padding:16px 18px;">
              <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:${kpi.bg === '#2563eb' ? '#bfdbfe' : '#94a3b8'};margin-bottom:6px;">${kpi.label}</div>
              <div style="font-size:22px;font-weight:700;color:${kpi.color};">${kpi.value}</div>
              ${kpi.sub ? `<div style="font-size:11px;color:#94a3b8;margin-top:3px;">${kpi.sub}</div>` : ''}
            </div>
          `,
            )
            .join('')}
        </div>
      </div>

      <!-- Breakdown -->
      <div>
        <div style="font-size:14px;font-weight:700;margin-bottom:10px;color:#1e293b;">Разбивка доходов</div>
        <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
          ${[
            ['Месячный оборот', formatCurrency(results.monthlyRevenue), '#10b981', false],
            [`Комиссия (${inputs.commissionPercent}%)`, `− ${formatCurrency(results.commission)}`, '#f59e0b', false],
            ['Доход после комиссии', formatCurrency(results.revenueAfterCommission), '#6366f1', false],
            ['Операционные расходы', `− ${formatCurrency(inputs.monthlyExpenses)}`, '#ef4444', false],
            ['Чистая прибыль инвестору', formatCurrency(results.netProfit), profitColor, true],
          ]
            .map(
              ([label, value, color, bold], i) => `
            <div style="
              display:flex;justify-content:space-between;align-items:center;
              padding:11px 16px;
              background:${i % 2 === 0 ? '#f8fafc' : '#fff'};
              font-size:13px;
              ${bold ? 'border-top:1px solid #e2e8f0;' : ''}
            ">
              <span style="color:${bold ? '#1e293b' : '#64748b'};font-weight:${bold ? '700' : '400'};">${label}</span>
              <span style="font-weight:700;color:${color};">${value}</span>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top:32px;text-align:center;font-size:11px;color:#cbd5e1;">
        Car ROI Calculator · Все расчёты носят ориентировочный характер
      </div>
    </div>
  `;
}

export async function generatePdf(inputs: CarInputs, results: CalcResults): Promise<void> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.innerHTML = buildReportHtml(inputs, results);
  document.body.appendChild(container);

  const el = container.querySelector('#pdf-report') as HTMLElement;

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pdfW = 210;
    const pdfH = (canvas.height * pdfW) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
    pdf.save('car-roi-report.pdf');
  } finally {
    document.body.removeChild(container);
  }
}
