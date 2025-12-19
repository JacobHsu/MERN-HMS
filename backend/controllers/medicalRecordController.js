import medicalRecordModel from "../models/medicalRecordModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// 醫生創建病歷
const createMedicalRecord = async (req, res) => {
    try {
        const { docId } = req.body;
        const { patientId, appointmentId, diagnosis, symptoms, treatment, prescription, notes, followUpDate } = req.body;

        if (!patientId || !diagnosis) {
            return res.json({ success: false, message: '病患ID和診斷內容為必填' });
        }

        const newRecord = new medicalRecordModel({
            patientId,
            doctorId: docId,
            appointmentId: appointmentId || null,
            diagnosis,
            symptoms: symptoms || [],
            treatment: treatment || '',
            prescription: prescription || [],
            notes: notes || '',
            followUpDate: followUpDate || null
        });

        await newRecord.save();

        res.json({ success: true, message: '病歷建立成功', record: newRecord });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 取得病患的所有病歷 (醫生端)
const getPatientRecords = async (req, res) => {
    try {
        const { patientId } = req.params;

        const records = await medicalRecordModel.find({ patientId })
            .populate('doctorId', 'name speciality image')
            .sort({ createdAt: -1 });

        res.json({ success: true, records });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 取得單筆病歷詳情
const getRecordById = async (req, res) => {
    try {
        const { recordId } = req.params;

        const record = await medicalRecordModel.findById(recordId)
            .populate('doctorId', 'name speciality image')
            .populate('patientId', 'name email phone');

        if (!record) {
            return res.json({ success: false, message: '找不到此病歷' });
        }

        res.json({ success: true, record });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 更新病歷 (僅建立該病歷的醫生可更新)
const updateMedicalRecord = async (req, res) => {
    try {
        const { docId } = req.body;
        const { recordId } = req.params;
        const { diagnosis, symptoms, treatment, prescription, notes, followUpDate } = req.body;

        const record = await medicalRecordModel.findById(recordId);

        if (!record) {
            return res.json({ success: false, message: '找不到此病歷' });
        }

        if (record.doctorId.toString() !== docId) {
            return res.json({ success: false, message: '只有建立此病歷的醫生可以更新' });
        }

        const updatedRecord = await medicalRecordModel.findByIdAndUpdate(
            recordId,
            {
                diagnosis: diagnosis || record.diagnosis,
                symptoms: symptoms || record.symptoms,
                treatment: treatment || record.treatment,
                prescription: prescription || record.prescription,
                notes: notes || record.notes,
                followUpDate: followUpDate || record.followUpDate,
                updatedAt: Date.now()
            },
            { new: true }
        );

        res.json({ success: true, message: '病歷更新成功', record: updatedRecord });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 取得醫生的所有病歷記錄
const getDoctorRecords = async (req, res) => {
    try {
        const { docId } = req.body;

        const records = await medicalRecordModel.find({ doctorId: docId })
            .populate('patientId', 'name email phone image')
            .sort({ createdAt: -1 });

        res.json({ success: true, records });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 病患取得自己的病歷
const getMyRecords = async (req, res) => {
    try {
        const { userId } = req.body;

        const records = await medicalRecordModel.find({ patientId: userId })
            .populate('doctorId', 'name speciality image')
            .sort({ createdAt: -1 });

        res.json({ success: true, records });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 取得所有病歷 (Admin)
const getAllRecords = async (req, res) => {
    try {
        console.log("🔍 Admin Request: Fetching all medical records...");
        const records = await medicalRecordModel.find({})
            .populate('doctorId', 'name speciality')
            .populate('patientId', 'name email')
            .sort({ createdAt: -1 });
        
        console.log(`✅ Found ${records.length} records in database.`);
        res.json({ success: true, records });

    } catch (error) {
        console.log("❌ Error in getAllRecords:", error);
        res.json({ success: false, message: error.message });
    }
};

export {
    createMedicalRecord,
    getPatientRecords,
    getRecordById,
    updateMedicalRecord,
    getDoctorRecords,
    getMyRecords,
    getAllRecords
};
