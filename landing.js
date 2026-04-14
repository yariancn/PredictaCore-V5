// landing.js - ACTUALIZACIÓN COMERCIAL (OFERTA $239 + RECURRENCIA $15)

// ... (Dentro de getLandingHTML, localiza el div 'upsell-stage')
`
<div id="upsell-stage" class="hidden-flow terminal-box p-8 md:p-12 text-center border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
    <div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
    </div>
    <h2 class="text-3xl font-bold text-white mb-2">Radiografía Enviada</h2>
    <p class="text-zinc-400 mb-8 text-sm">El reporte inicial ha sido entregado a <span id="sent-email" class="text-white font-bold"></span>.</p>
    
    <div class="bg-red-950/20 border border-red-900/50 p-6 rounded-lg mb-8 text-left">
        <h3 class="text-red-500 font-bold uppercase tracking-widest text-xs mb-3 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Diagnóstico de Riesgo Elevado
        </h3>
        <p class="text-sm text-zinc-300">Nuestro escaneo detectó fricción severa. Estás perdiendo capital en cada visita. El reporte Lite solo muestra la superficie de la hemorragia.</p>
    </div>

    <div class="border-t border-zinc-800 pt-8">
        <div class="inline-block bg-zinc-900 border border-zinc-700 px-4 py-1 rounded-full text-[10px] text-zinc-400 uppercase tracking-widest mb-4">
            Oferta de Desbloqueo Inmediato
        </div>
        <h4 class="text-4xl font-extrabold text-white mb-2 tracking-tighter">$239 <span class="text-sm text-zinc-500 line-through font-normal">$700 USD</span></h4>
        <p class="text-xs text-emerald-500 font-bold uppercase tracking-widest mb-6">Incluye Suscripción Titán ($15/mes)</p>
        
        <p class="text-sm text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed">
            Obtén el **Reporte Titán Completo (15 Puntos)** + Acceso al **Monitor de Fricción Mensual**. Identificamos y vigilamos tus fugas 24/7 para asegurar que tu rentabilidad nunca vuelva a caer.
        </p>

        <button class="w-full md:w-auto bg-emerald-600 text-white font-bold py-4 px-12 rounded-lg text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] mb-4">
            Activar Protección Titán
        </button>

        <div class="max-w-xs mx-auto text-[9px] text-zinc-600 uppercase leading-tight tracking-wider">
            Al activar, aceptas el cargo único de $239 y la suscripción recurrente de $15/mes. La suscripción es cancelable tras el primer periodo de 30 días. No hay reembolsos del mes en curso. Se entregará un reporte final al concluir el plazo contratado antes del cierre.
        </div>
    </div>
</div>
`
