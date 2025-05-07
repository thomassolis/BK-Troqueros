import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_SEE), VerifyPermissionMiddleware, (req, res)=>{
  console.log('params: ', req.query);
    const data = [
            {
            id_cliente: 'RUC123',
            nombre: "MLC333",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "1",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "2",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "3",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "4",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "5",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "6",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "7",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "8",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },{
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "9",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "10",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "11",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "12",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "13",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "14",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "15",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "16",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "17",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "18",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "19",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "20",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "5",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "6",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "7",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "8",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },{
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "9",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "10",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "11",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "12",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "13",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "14",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "15",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          },
          {
            nombre: "MLC",
            tipoCliente: "business",
            personaContacto: "Francisco",
            telefono: "16",
            correo: "Francisco@gmail.com",
            fechaUltimoPedido: "2024-12-02"
          }
      ];
  
      res.status(200).json({
        success: true,
        message: "",
        customers: {
          data,
          paginaActual: 1,
          totalRegistros: 32,
          limite: 20
        }
      });
});

router.get('/:id', (req, res) => {
  console.log('params22: ', req.params);
    const data = 
            {
            id_cliente: 'RUC123',
            nombre: "MLC2222",
            ruc: "TEST",            
            direccion: "Obarrio",
            
            nombrePersonaContacto: "Francisco",
            telPersonaContacto: 'TELEFONO',
            emailPersonaContacto: 'EMAIL',

            nombrePersonaFinanciera: 'NOMBRE',
            telContactoFinanciero: "1",
            emailContactoFinanciero: 'EMAILfINANCIERO',

            
            fechaUltimoPedido: "2024-12-02",
            
          }      
  
      res.status(200).json({
        success: true,
        message: "Bien",
        data
      });
});

router.post('/add', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_CREATE), VerifyPermissionMiddleware);
router.put('/update', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_UPD), VerifyPermissionMiddleware);
router.delete('/delete', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_DEL), VerifyPermissionMiddleware);

export default router;