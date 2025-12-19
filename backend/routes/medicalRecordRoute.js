import express from 'express';
import { 
    createMedicalRecord, 
    getPatientRecords, 
    getRecordById, 
    updateMedicalRecord, 
    getDoctorRecords,
    getMyRecords,
    getAllRecords
} from '../controllers/medicalRecordController.js';
import authDoctor from '../middleware/authDoctor.js';
import authUser from '../middleware/authUser.js';
import authAdmin from '../middleware/authAdmin.js';

const medicalRecordRouter = express.Router();

// 醫生端 API
medicalRecordRouter.post('/create', authDoctor, createMedicalRecord);
medicalRecordRouter.get('/patient/:patientId', authDoctor, getPatientRecords);
medicalRecordRouter.put('/update/:recordId', authDoctor, updateMedicalRecord);
medicalRecordRouter.get('/doctor-records', authDoctor, getDoctorRecords);

// 病患端 API
medicalRecordRouter.get('/my-records', authUser, getMyRecords);

// 共用 API (需要驗證)
medicalRecordRouter.get('/detail/:recordId', authDoctor, getRecordById);

// Admin API
medicalRecordRouter.get('/all', authAdmin, getAllRecords);

export default medicalRecordRouter;
