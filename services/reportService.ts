
import { Asset } from '../types';

export class ReportService {
  /**
   * Exporta dados para formato compatível com Excel
   */
  exportToExcel(data: any[], filename: string) {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join('\t');
    const rows = data.map(obj => 
      Object.values(obj)
        .map(val => typeof val === 'string' ? val.replace(/\t/g, ' ') : val)
        .join('\t')
    ).join('\n');

    const excelContent = headers + '\n' + rows;
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_EXCEL_${new Date().getTime()}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Exporta dados otimizados para Power BI (CSV Flat)
   */
  exportToPowerBI(data: any[], filename: string) {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join(';');
    const rows = data.map(obj => 
      Object.values(obj)
        .map(val => {
          if (val === null || val === undefined) return "";
          const str = String(val).replace(/;/g, ',');
          return `"${str}"`;
        })
        .join(';')
    ).join('\n');

    const csvContent = "\uFEFF" + headers + '\n' + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_PBI_DATASET.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Abre janela de carregamento para o PDF
   */
  openLoadingPDF(): Window | null {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <body style="background:#0a0a0c;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;margin:0;">
            <div style="text-align:center;">
              <div style="width:50px;height:50px;border:3px solid #10b981;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px;"></div>
              <h2 style="color:#10b981;font-weight:900;letter-spacing:-1px;">VANTEZ KERNEL IA</h2>
              <p style="color:#666;text-transform:uppercase;letter-spacing:3px;font-size:9px;">Gerando Inteligência e Gráficos Quantitativos...</p>
            </div>
            <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
          </body>
        </html>
      `);
    }
    return win;
  }

  /**
   * Finaliza o PDF injetando Chart.js e dados reais
   */
  finalizePDF(printWindow: Window | null, title: string, content: string, dataSummary: string, chartData?: {labels: string[], values: number[]}) {
    if (!printWindow) return;

    const chartScript = chartData ? `
      const ctx = document.getElementById('reportChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ${JSON.stringify(chartData.labels)},
          datasets: [{
            label: 'Cotação Atual (R$)',
            data: ${JSON.stringify(chartData.values)},
            backgroundColor: '#10b981',
            borderRadius: 8,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: '#eee' }, ticks: { font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      });
    ` : '';

    const html = `
      <html>
        <head>
          <title>${title}</title>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; background: #fff; color: #000; padding: 50px; line-height: 1.6; }
            .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-weight: 900; font-size: 24px; letter-spacing: -1px; }
            .logo span { color: #10b981; font-style: italic; }
            h1 { font-size: 32px; font-weight: 900; margin: 0; color: #000; text-transform: uppercase; }
            .meta { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 2px; }
            .summary { background: #f8fafc; border-radius: 20px; padding: 30px; margin: 30px 0; border: 1px solid #e2e8f0; }
            .chart-container { height: 300px; margin: 40px 0; background: #fff; border: 1px solid #eee; padding: 20px; border-radius: 20px; }
            .content { font-size: 13px; color: #334155; text-align: justify; columns: 1; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; font-size: 9px; color: #94a3b8; text-align: center; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">VANTEZ<span>.PRO</span></div>
              <div class="meta">Financial Intelligence Terminal • Audit ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            </div>
            <div class="meta" style="text-align: right;">Gerado em: ${new Date().toLocaleString()}</div>
          </div>
          
          <h1>${title}</h1>
          
          <div class="summary">
            <div class="meta" style="margin-bottom: 10px; color: #10b981;">Snapshot de Dados Quantitativos</div>
            <div style="font-size: 11px; font-family: monospace; line-height: 1.8;">${dataSummary}</div>
          </div>

          ${chartData ? '<div class="chart-container"><canvas id="reportChart"></canvas></div>' : ''}

          <div class="content">
            <div class="meta" style="margin-bottom: 15px; color: #10b981;">Análise Estratégica IA</div>
            ${content.replace(/\n/g, '<br/>')}
          </div>

          <div class="footer">
            ESTE RELATÓRIO É PARA FINS INFORMATIVOS. VANTEZ TERMINAL PRO © ${new Date().getFullYear()}<br/>
            DADOS SINCRONIZADOS VIA KERNEL GEMINI 2.5 FLASH NATIVE.
          </div>

          <script>
            ${chartScript}
            window.onload = function() {
              setTimeout(() => { window.print(); }, 1000);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

export const reportService = new ReportService();
