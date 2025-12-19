import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import 'dotenv/config';
import medicalRecordModel from "./models/medicalRecordModel.js";
import userModel from "./models/userModel.js";
import doctorModel from "./models/doctorModel.js";

// Demo 病歷資料
const demoMedicalRecords = [
    {
        diagnosis: "上呼吸道感染",
        symptoms: ["咳嗽", "流鼻水", "喉嚨痛", "輕微發燒"],
        treatment: "多休息、多喝水，服用處方藥物",
        prescription: [
            { medicine: "普拿疼", dosage: "500mg", duration: "每日3次，連續5天", notes: "飯後服用" },
            { medicine: "Mucosolvan", dosage: "30mg", duration: "每日3次，連續7天", notes: "化痰藥" }
        ],
        notes: "患者症狀輕微，預計一週內可康復。如發燒超過38.5度請回診。",
        followUpDays: 7
    },
    {
        diagnosis: "高血壓第一期",
        symptoms: ["頭痛", "頭暈", "心悸"],
        treatment: "生活型態調整，低鈉飲食，規律運動，服用降壓藥",
        prescription: [
            { medicine: "Amlodipine", dosage: "5mg", duration: "每日1次，長期服用", notes: "早上服用" }
        ],
        notes: "血壓 145/92 mmHg。建議減少鹽分攝取，每週運動至少150分鐘。一個月後回診追蹤。",
        followUpDays: 30
    },
    {
        diagnosis: "過敏性鼻炎",
        symptoms: ["打噴嚏", "鼻塞", "流鼻水", "眼睛癢"],
        treatment: "避免過敏原，使用抗組織胺藥物，必要時使用鼻噴劑",
        prescription: [
            { medicine: "Cetirizine", dosage: "10mg", duration: "每日1次，症狀期間服用", notes: "可能會嗜睡" },
            { medicine: "Fluticasone鼻噴劑", dosage: "每鼻孔2噴", duration: "每日1次", notes: "早上使用" }
        ],
        notes: "建議保持居家環境清潔，使用空氣清淨機。季節變換時提前預防。",
        followUpDays: 14
    }
];

const seedMedicalRecords = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
        console.log("✅ 資料庫連接成功 (Database: prescripto)");

        // 1. 找或建立 Demo 病患 (user@example.com)
        let demoUser = await userModel.findOne({ email: "user@example.com" });
        if (!demoUser) {
            console.log("📝 建立 Demo 病患帳號...");
            const hashedPassword = await bcrypt.hash("user123", 10);
            demoUser = new userModel({
                name: "Demo User",
                email: "user@example.com",
                password: hashedPassword,
                phone: "0912345678",
                gender: "Male",
                dob: "1990-01-01",
                address: { line1: "台北市中正區", line2: "示範路123號" }
            });
            await demoUser.save();
            console.log("   ✅ 病患: user@example.com / user123");
        } else {
            console.log("✅ 找到 Demo 病患: user@example.com");
        }

        // 2. 找或建立 Demo 醫生 (doctor@example.com)
        let demoDoctor = await doctorModel.findOne({ email: "doctor@example.com" });
        if (!demoDoctor) {
            console.log("📝 建立 Demo 醫生帳號...");
            const hashedPassword = await bcrypt.hash("doctor123", 10);
            demoDoctor = new doctorModel({
                name: "Dr. Demo",
                email: "doctor@example.com",
                password: hashedPassword,
                image: "https://randomuser.me/api/portraits/men/1.jpg",
                speciality: "General physician",
                degree: "MBBS",
                experience: "5 Years",
                about: "Demo doctor for testing purposes.",
                available: true,
                fees: 500,
                address: { line1: "台北市中正區", line2: "醫院路456號" },
                date: Date.now()
            });
            await demoDoctor.save();
            console.log("   ✅ 醫生: doctor@example.com / doctor123");
        } else {
            console.log("✅ 找到 Demo 醫生: doctor@example.com");
        }

        // 3. 清除並建立病歷
        await medicalRecordModel.deleteMany({ patientId: demoUser._id });
        console.log("🗑️  清除舊的病歷資料");

        const records = [];
        for (let i = 0; i < demoMedicalRecords.length; i++) {
            const demoRecord = demoMedicalRecords[i];
            const followUpDate = new Date();
            followUpDate.setDate(followUpDate.getDate() + demoRecord.followUpDays);

            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - (30 - i * 10)); // 過去30天內

            records.push({
                patientId: demoUser._id,
                doctorId: demoDoctor._id,
                diagnosis: demoRecord.diagnosis,
                symptoms: demoRecord.symptoms,
                treatment: demoRecord.treatment,
                prescription: demoRecord.prescription,
                notes: demoRecord.notes,
                followUpDate: followUpDate,
                createdAt: createdAt,
                updatedAt: createdAt
            });
        }

        await medicalRecordModel.insertMany(records);
        console.log(`✅ 成功建立 ${records.length} 筆 Demo 病歷資料`);

        console.log("\n========================================");
        console.log("🎉 Demo 帳號設定完成！");
        console.log("========================================");
        console.log("📋 管理者: admin@example.com / admin123");
        console.log("👨‍⚕️ 醫生:   doctor@example.com / doctor123");
        console.log("👤 病患:   user@example.com / user123");
        console.log("========================================\n");

        process.exit(0);

    } catch (error) {
        console.error("❌ 錯誤:", error.message);
        process.exit(1);
    }
};

seedMedicalRecords();
