try {
                    const startRes = await fetch('/start', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ dna: dna })
                    });
                    
                    const startData = await startRes.json();
                    
                    if (!startRes.ok) {
                        throw new Error(startData.error || "Error al iniciar auditoría");
                    }
                    
                    const jobId = startData.jobId;

                    status.innerText = 'AUDITORÍA CORRIENDO EN SEGUNDO PLANO (PUEDES CAMBIAR DE PESTAÑA)';
