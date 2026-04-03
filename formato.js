const ESTILOS_PDF = `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
    body { font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.7; text-align: justify !important; padding: 40px; background: #ffffff; }
    h3 { color: #10b981 !important; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-top: 50px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; font-size: 16pt; }
    .capsula-contexto { background: #f8fafc; border-left: 5px solid #10b981; padding: 20px; margin: 20px 0 30px 0; font-size: 11pt; color: #64748b; font-style: italic; border-radius: 0 12px 12px 0; }
    table { width: 100%; border-collapse: collapse; margin: 30px 0; border: 1px solid #e2e8f0; font-size: 10pt; }
    th { background: #1e293b; color: #ffffff; padding: 15px; text-align: left; text-transform: uppercase; letter-spacing: 1px; }
    td { border: 1px solid #e2e8f0; padding: 15px; vertical-align: top; }
    section { page-break-after: always; }
    .logo-header { color: #10b981; font-weight: 800; font-size: 24pt; margin-bottom: 10px; border-bottom: 4px solid #10b981; display: inline-block; }
</style>
`;
module.exports = { ESTILOS_PDF };
