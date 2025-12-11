# MyKad Blockchain System - Complete Edition

A comprehensive blockchain-based digital identity system for Malaysian MyKad with smart contracts and personal data storage.

## 🌟 Key Features

### 1. Blockchain Security
- ✅ SHA-256 cryptographic hashing
- ✅ Proof-of-work mining
- ✅ Immutable data storage
- ✅ Chain validation

### 2. Smart Contracts
- ✅ Automated subsidy approval
- ✅ Senior citizen benefits
- ✅ Fraud detection
- ✅ Multi-signature approvals

### 3. **Personal Data Storage** 🆕
- ✅ Secure storage of personal information
- ✅ Multiple data categories (Medical, Education, Financial, etc.)
- ✅ Privacy controls (Public/Private data)
- ✅ Data versioning and audit trail
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Data export functionality
- ✅ Blockchain-recorded deletions

### 4. Digital Identity
- ✅ QR code verification
- ✅ Instant authenticity checks
- ✅ Integrated multi-service platform

## 📊 Personal Data Categories

The system supports storage of:

1. **Medical Records** - Health history, prescriptions, vaccinations
2. **Education Certificates** - Degrees, diplomas, certifications
3. **Financial Information** - Bank accounts, investments
4. **Employment History** - Work experience, references
5. **Property Ownership** - Land titles, property documents
6. **Family Information** - Spouse, children, dependents
7. **Emergency Contacts** - Critical contact information
8. **Insurance Policies** - Health, life, vehicle insurance
9. **Legal Documents** - Wills, contracts, agreements
10. **Driving License** - License details and history
11. **Passport Information** - Travel documents
12. **Vaccination Records** - COVID-19, immunizations
13. **Banking Details** - Account information
14. **Tax Information** - Tax IDs, returns
15. **Other** - Custom categories

## 🔐 Privacy & Security

### Data Privacy Levels:
- **Private Data**: Only accessible by the IC holder
- **Public Data**: Viewable by authorized parties

### Security Features:
- Each data entry has a unique hash
- All changes are recorded on blockchain
- Deletions create permanent deletion records
- Version control for data updates
- Audit trail for all operations

## 📡 API Endpoints

### MyKad Registration
```
POST /api/register
```

### Personal Data Management
```
GET    /api/personal-data              # Get all data
GET    /api/personal-data?icNumber=X   # Get data by IC
POST   /api/personal-data              # Add new data
PUT    /api/personal-data              # Update data
DELETE /api/personal-data?dataId=X    # Delete data
```

### IC-Specific Operations
```
GET    /api/personal-data/[icNumber]   # Get all data for IC
DELETE /api/personal-data/[icNumber]   # Delete all data for IC
```

### Verification & Blockchain
```
POST /api/verify                       # Verify MyKad
GET  /api/blockchain                   # Get blockchain
GET  /api/contracts                    # Get smart contracts
GET  /api/executions                   # Get contract executions
```

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/mykad-blockchain-system.git
cd mykad-blockchain-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

### 4. Build for Production
```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push code to GitHub
2. Import repository in Vercel
3. Deploy (automatic)

## 💡 Usage Examples

### Add Personal Data
```javascript
POST /api/personal-data
{
  "icNumber": "123456-78-9012",
  "dataType": "Blood Type",
  "dataCategory": "Medical Records",
  "dataValue": "O+",
  "description": "Blood type for medical emergencies",
  "isPrivate": true
}
```

### Retrieve Personal Data
```javascript
GET /api/personal-data/123456-78-9012

Response:
{
  "success": true,
  "icNumber": "123456-78-9012",
  "recordCount": 5,
  "data": [...]
}
```

### Update Data
```javascript
PUT /api/personal-data
{
  "dataId": "PD1234567890ABC",
  "updates": {
    "dataValue": "O+ (Verified 2024)"
  }
}
```

### Delete Data
```javascript
DELETE /api/personal-data?dataId=PD1234567890ABC
```

## 🏗️ Architecture
```
User Interface (React)
        ↓
API Routes (Next.js)
        ↓
Blockchain Layer
        ↓
┌─────────────────┬─────────────────┐
│ Smart Contracts │ Personal Data   │
│ Engine          │ Manager         │
└─────────────────┴─────────────────┘
```

## 🔒 Data Flow
```
1. User adds personal data
2. Data stored in PersonalDataManager
3. Block created with data hash
4. Block mined and added to chain
5. Smart contracts triggered (if applicable)
6. Data becomes immutable
7. Deletion = New block recording deletion
```

## 📈 Statistics & Analytics

The system tracks:
- Total personal records
- Records per IC number
- Private vs public data ratio
- Data by category
- Blockchain integrity status
- Smart contract executions

## 🛡️ Security Best Practices

1. **Never store sensitive data unencrypted**
2. **Use HTTPS in production**
3. **Implement proper authentication**
4. **Audit access logs regularly**
5. **Backup blockchain data**
6. **Test smart contracts thoroughly**

## 📝 License

MIT License - Free for educational and commercial use

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📧 Support

For issues: [GitHub Issues](https://github.com/yourusername/mykad-blockchain-system/issues)

---

**Built with ❤️ for Malaysian Digital Transformation**

Version 2.0 - Now with Personal Data Storage
```

---

### 7. **.gitignore**
```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# IDE
.vscode/
.idea/
*.swp
*.swo
