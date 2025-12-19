import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment' },
    // 診斷資訊
    diagnosis: { type: String, required: true },
    symptoms: { type: [String], default: [] },
    treatment: { type: String, default: '' },
    // 處方 (簡化版 - 可擴展)
    prescription: [{
        medicine: { type: String },
        dosage: { type: String },
        duration: { type: String },
        notes: { type: String }
    }],
    // 醫生筆記
    notes: { type: String, default: '' },
    // 追蹤訪問日期
    followUpDate: { type: Date },
    // 時間戳
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 索引優化查詢
medicalRecordSchema.index({ patientId: 1, createdAt: -1 });
medicalRecordSchema.index({ doctorId: 1, createdAt: -1 });

const medicalRecordModel = mongoose.models.medicalRecord || mongoose.model("medicalRecord", medicalRecordSchema);

export default medicalRecordModel;
