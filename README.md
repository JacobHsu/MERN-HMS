# Prescripto - Hospital Management System

## Description
**Prescripto** is a comprehensive Hospital Management System built on the MERN stack to enhance hospital operations. This system includes features such as secure user authentication, efficient appointment scheduling, patient record management, and real-time communication between doctors and patients. It provides a scalable and user-friendly platform to streamline healthcare workflows and improve the hospital experience.

## Features
- **User Authentication**: Secure login for patients, doctors, and administrators.
- **Appointment Scheduling**: Easy booking, rescheduling, and cancellation of appointments.
- **Patient Records Management**: Store, access, and update patient health records.
- **Doctor-Patient Communication**: Real-time messaging for consultations and follow-ups.
- **Admin Dashboard**: Manage users, appointments, and view analytics.
- **Secure Data Storage**: Ensure patient privacy and data security with MongoDB.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js and Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: Redux (optional)

## Getting Started

### Quick Start (Recommended)

We provide convenient scripts to manage the entire project:

**Windows (PowerShell):**
```powershell
# Install all dependencies
.\dev.ps1 install

# Start all services (Backend, Frontend, Admin)
.\dev.ps1 start

# Clean all dependencies
.\dev.ps1 clean
```

**Linux/macOS (Bash):**
```bash
# Install all dependencies
./dev.sh install

# Start all services (Backend, Frontend, Admin)
./dev.sh start

# Clean all dependencies
./dev.sh clean
```

For detailed instructions, see [Development Guide](./開發指南.md).

### Prerequisites
- Node.js installed (v18 or higher recommended)
- MongoDB installed or access to a MongoDB cloud instance
- Git installed
- pnpm installed (`npm install -g pnpm`)

### Manual Installation

If you prefer to install and run services manually:

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Prescripto-Hospital_Management_System.git
   cd Prescripto-Hospital_Management_System
   ```

2. **Install dependencies for each service**
   ```bash
   # Backend
   cd backend
   pnpm install
   cd ..

   # Frontend
   cd frontend
   pnpm install
   cd ..

   # Admin
   cd admin
   pnpm install
   cd ..
   ```

3. **Set up environment variables**

   A `.env` file has been created in the `backend` directory with template values. You need to configure:

   **Required Services:**
   - **MongoDB Atlas** - Database service
     - 📖 [MongoDB 設定教學](./MongoDB設定教學.md) | [MongoDB Setup Guide](./MongoDB設定教學.md)
   - **Cloudinary** - Image upload service
     - 📖 [Cloudinary 設定教學](./Cloudinary設定教學.md) | [Cloudinary Setup Guide](./Cloudinary設定教學.md)

   **Default Admin Login (already configured):**
   ```
   Email: admin@example.com
   Password: admin123
   ```

   **Optional Services (can use dummy values for development):**
   - Stripe / Razorpay - Payment gateways (only needed for payment features)

   Complete environment variables list:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
   JWT_SECRET=your_jwt_secret
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   STRIPE_SECRET_KEY=your_stripe_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   CURRENCY=INR
   ```

4. **Start services (requires 3 terminals)**

   Terminal 1 - Backend:
   ```bash
   cd backend
   pnpm run server
   ```

   Terminal 2 - Frontend:
   ```bash
   cd frontend
   pnpm run dev
   ```

   Terminal 3 - Admin:
   ```bash
   cd admin
   pnpm run dev
   ```

# Topics
Hospital Management, MERN Stack, MongoDB, Express.js, React, Node.js, Healthcare App, Patient Records, Appointments.

# Contributors
Niraj Kumar [Github](https://github.com/meniraj07)

# Deployment Links
[Prescripto Backend](https://prescriptobackend-4ylq.onrender.com)

[Prescripto Patient Panel](https://prescripto-hospital-management-system.vercel.app/)

[Prescripto Admin/Doctor Panel](https://prescripto-hospital-management-system-c29o.vercel.app/)

# Contact
For any questions or feedback, please contact [Niraj Kumar](https://www.linkedin.com/in/nirajkumar-nk/)

# License
This project is licensed under the MIT License.
