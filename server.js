// ... (todo el código anterior de Puppeteer se queda igual)
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        // RESTAURACIÓN EXACTA DE TU LÓGICA DE RESEND ORIGINAL
        const { data, error } = await resend.emails.send({
            from: 'PredictaCore Titán <reportes@predictacore.ai>',
            to: emailDestino,
            subject: isLite ? 'Tu Auditoría Forense PredictaCore (Lite)' : 'Auditoría Forense Titán Completa',
            text: 'Adjunto encontrarás la radiografía de conversión de tu activo digital. Ábrelo en un ordenador para su correcta visualización.',
            attachments: [
                {
                    filename: isLite ? 'PREDICTACORE_LITE.pdf' : 'PREDICTACORE_TITAN.pdf',
                    content: pdfBuffer
                }
            ]
        });

        if (error) {
            throw new Error(`Resend API Error: ${error.message}`);
        }

        console.log(`>>> Sellado. Reporte entregado con éxito a ${emailDestino}. ID: ${data.id}`);
    } catch (error) { 
        if(browser) await browser.close(); 
        console.error(">>> Error crítico al ensamblar o enviar correo:", error); 
    }
}
