import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import doctorModel from './models/doctorModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Doctor seed data
const doctorsData = [
    {
        name: 'Dr. Richard James',
        imageName: 'doc1.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Richard James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Richard James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Emily Larson',
        imageName: 'doc2.png',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Emily Larson has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Emily Larson has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Sarah Patel',
        imageName: 'doc3.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Year',
        about: 'Dr. Sarah Patel has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Sarah Patel has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Christopher Lee',
        imageName: 'doc4.png',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Christopher Lee has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Christopher Lee has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Jennifer Garcia',
        imageName: 'doc5.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Jennifer Garcia has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Jennifer Garcia has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Andrew Williams',
        imageName: 'doc6.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Andrew Williams has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Andrew Williams has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Christopher Davis',
        imageName: 'doc7.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Christopher Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Christopher Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Timothy White',
        imageName: 'doc8.png',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Timothy White has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Timothy White has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Ava Mitchell',
        imageName: 'doc9.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Year',
        about: 'Dr. Ava Mitchell has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Ava Mitchell has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Jeffrey King',
        imageName: 'doc10.png',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Jeffrey King has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Jeffrey King has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Zoe Kelly',
        imageName: 'doc11.png',
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Zoe Kelly has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Zoe Kelly has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Patrick Harris',
        imageName: 'doc12.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Patrick Harris has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Patrick Harris has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Chloe Evans',
        imageName: 'doc13.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Chloe Evans has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Chloe Evans has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Ryan Martinez',
        imageName: 'doc14.png',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Ryan Martinez has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Ryan Martinez has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Amelia Hill',
        imageName: 'doc15.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Year',
        about: 'Dr. Amelia Hill has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Amelia Hill has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    }
];

// Generate email from name
function generateEmail(name) {
    const cleanName = name.replace('Dr. ', '').toLowerCase().replace(' ', '.');
    return `${cleanName}@hospital.com`;
}

// Upload image to Cloudinary
async function uploadImage(imagePath) {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            resource_type: 'image'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

// Seed doctors
async function seedDoctors() {
    try {
        // Connect to MongoDB (use same database as server: prescripto)
        console.log('Connecting to MongoDB...');
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
        console.log('Connected to MongoDB successfully!');

        // Clear existing doctors (optional - comment out if you want to keep existing doctors)
        console.log('\nClearing existing doctors...');
        await doctorModel.deleteMany({});
        console.log('Existing doctors cleared.');

        // Hash default password for all doctors
        const defaultPassword = 'doctor123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        console.log('\nSeeding doctors...');
        console.log('Default password for all doctors: doctor123\n');

        // Create each doctor
        for (const doctorData of doctorsData) {
            try {
                // Generate email
                const email = generateEmail(doctorData.name);

                // Construct image path
                const imagePath = path.join(__dirname, '..', 'frontend', 'src', 'assets', doctorData.imageName);

                // Check if image exists
                if (!fs.existsSync(imagePath)) {
                    console.error(`Image not found: ${imagePath}`);
                    continue;
                }

                // Upload image to Cloudinary
                console.log(`Uploading ${doctorData.imageName} to Cloudinary...`);
                const imageUrl = await uploadImage(imagePath);
                console.log(`✓ Uploaded successfully`);

                // Create doctor
                const doctor = new doctorModel({
                    name: doctorData.name,
                    email: email,
                    password: hashedPassword,
                    image: imageUrl,
                    speciality: doctorData.speciality,
                    degree: doctorData.degree,
                    experience: doctorData.experience,
                    about: doctorData.about,
                    fees: doctorData.fees,
                    address: doctorData.address,
                    date: Date.now(),
                    available: true
                });

                await doctor.save();
                console.log(`✓ Created doctor: ${doctorData.name} (${email})\n`);

            } catch (error) {
                console.error(`Error creating doctor ${doctorData.name}:`, error.message);
            }
        }

        console.log('\n✅ Doctor seeding completed!');
        console.log('\n📋 Login credentials for all doctors:');
        console.log('Email: [firstname.lastname]@hospital.com (e.g., richard.james@hospital.com)');
        console.log('Password: doctor123');
        console.log('\nYou can now login with any of the seeded doctors using their email and password.');

    } catch (error) {
        console.error('Error seeding doctors:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    }
}

// Run the seed function
seedDoctors();
