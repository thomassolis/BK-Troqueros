import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Actualiza el estado del conductor y del vehículo
export const UpdStatusVehicleDriverRequest = async (transaction, services) => {
    try {
        const request = await transaction.request();

        for (const [index, item] of services.entries()) {
            request.input(`Status${index}`, sql.VarChar, item.status)
            // Actualiza el conductor
            await request
                .input(`idConductor${index}`, sql.VarChar, item.id_conductor)
                .query(`
                    UPDATE [Troqueros].[dbo].[Conductores] 
                        SET [status] = @Status${index},
                            [fecha_modificación] = GETDATE()
                    WHERE [id_conductor] = @idConductor${index}`
                );

            // Actualiza el cabezal
            await request
                .input(`idCabezal${index}`, sql.VarChar, item.id_cabezal)
                .query(`
                    UPDATE [Troqueros].[dbo].[Cabezal]
                        SET [status] = @Status${index},
                            [fecha_modificación] = GETDATE()
                    WHERE [id_cabezal] = @idCabezal${index}
                `);

            // Si hay chasis
            if (item?.id_chasis) {
                await request
                    .input(`idChasis${index}`, sql.VarChar, item.id_chasis)
                    .query(`
                        UPDATE [Troqueros].[dbo].[Chasis]
                            SET [status] = @Status${index},
                                [fecha_modificación] = GETDATE()
                        WHERE [id_chasis] = @idChasis${index}
                    `);
            }

            // Si hay furgón
            if (item?.id_furgon) {
                await request
                    .input(`idFurgon${index}`, sql.VarChar, item.id_furgon)
                    .query(`
                        UPDATE [Troqueros].[dbo].[Furgon]
                            SET [status] = @Status${index},
                                [fecha_modificación] = GETDATE()
                        WHERE [id_furgon] = @idFurgon${index}
                    `);
            }
        }

        return true;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.POST);
        HandleError(code, error.message, 'querys/requests/updateStatusVehicleDriverRequests/UpdStatusVehicleDriverRequest', error);
        throw new Error('Ha ocurrido un error al actualizar el estado del conductor y vehículo');
    }
}