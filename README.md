# Investment Platform Frontend

React frontend for USDC investment platform.

## Features
- User Authentication
- Investment Dashboard
- Real Deposit Processing
- Investment Tiers
- Referral System
- Admin Panel

## Setup
1. Install dependencies: `npm install`
2. Update API URL in components
3. Run: `npm start`

## Deploy to Vercel
1. Push this frontend folder to GitHub
2. Connect to Vercel
3. Build Command: `npm run build`
4. Output Directory: `build`
5. Deploy

## Environment
Update API_URL in all components to your backend URL:
```javascript
const API_URL = 'https://your-backend.vercel.app/api';
```