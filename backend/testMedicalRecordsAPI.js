import axios from 'axios';
import 'dotenv/config';

const testMedicalRecordsAPI = async () => {
    try {
        const backendUrl = 'http://localhost:4000';

        console.log('🔐 Step 1: Admin login...');
        const loginRes = await axios.post(`${backendUrl}/api/admin/login`, {
            email: 'admin@example.com',
            password: 'admin123'
        });

        if (!loginRes.data.success) {
            console.log('❌ Admin login failed:', loginRes.data.message);
            return;
        }

        const adminToken = loginRes.data.token;
        console.log('✅ Admin logged in successfully');
        console.log('   Token:', adminToken.substring(0, 20) + '...');

        console.log('\n📋 Step 2: Fetching all medical records...');
        const recordsRes = await axios.get(`${backendUrl}/api/medical-records/all`, {
            headers: { atoken: adminToken }
        });

        console.log('\n📊 API Response:');
        console.log('   Success:', recordsRes.data.success);
        console.log('   Records count:', recordsRes.data.records?.length || 0);

        if (recordsRes.data.records && recordsRes.data.records.length > 0) {
            console.log('\n✅ Sample record:');
            const sample = recordsRes.data.records[0];
            console.log('   Diagnosis:', sample.diagnosis);
            console.log('   Patient:', sample.patientId?.name || 'N/A');
            console.log('   Doctor:', sample.doctorId?.name || 'N/A');
            console.log('   Created:', sample.createdAt);
        } else {
            console.log('\n❌ No records found in the response');
        }

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
};

testMedicalRecordsAPI();
