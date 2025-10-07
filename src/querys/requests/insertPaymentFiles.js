import fs from 'fs/promises';
import path from 'path';

export const InsertPaymentFiles = async (transaction, files, idRequest) => {            

    // Asegurarse de que files es un arreglo
    const filesArray = Array.isArray(files) ? files : [files];

    try {
        
        const basePath = path.join(process.cwd(), 'src', 'adjuntos', 'Peticiones', 'comprobantes');
        const folderPath = path.join(basePath, idRequest.toString());                
        
        // Verificar si la carpeta base existe, si no crearla
        try {
            await fs.access(basePath);
        } catch {
            await fs.mkdir(basePath, { recursive: true });
        }
        
        // Crear la carpeta específica para esta petición
        await fs.mkdir(folderPath, { recursive: true });
        
        const savedFiles = [];
        
        for (const file of filesArray) {
            if (!file.data || !file.name) {
                console.warn('Archivo ignorado por falta de data o name:', file);
                continue;
            }
            
            try {
                const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\s+/g, '');
                const filePath = path.join(folderPath, safeFileName);
                
                await fs.writeFile(filePath, file.data);
                savedFiles.push(safeFileName);                
                
            } catch (fileError) {
                console.error(`❌ Error guardando archivo ${file.name}:`, fileError);
                // Continuar con los demás archivos aunque falle uno
            }
        }
                
        return savedFiles.length > 0;
        
    } catch (error) {
        console.error('❌ Error crítico al guardar archivos de pago:', error);
        throw error;
    }
}
