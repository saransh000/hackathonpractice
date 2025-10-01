# Network Access Instructions for Friends

## 🌐 How to Access the Hackathon Helper Tool

Your friend can now access your application from their computer on the same network!

### 📋 Access Details

**Application URL:** `http://172.26.81.221:5173`

### 🔐 Login Credentials

**Admin Account:**
- Email: `admin@hackathon.com`
- Password: `admin123`

**Regular User Account:**
- Email: `uday@gmail.com`
- Password: `user123`

### ✅ Setup Checklist

1. **Your Computer (Server Host):**
   - ✅ Backend server running on port 5000
   - ✅ Frontend server running on port 5173
   - ✅ CORS configured to allow network access
   - ✅ IP Address: 172.26.81.221
   - ⚠️ Make sure Windows Firewall allows incoming connections on ports 5000 and 5173

2. **Friend's Computer (Client):**
   - Must be on the **same network** (WiFi/LAN) as you
   - Open web browser (Chrome, Firefox, Edge, etc.)
   - Navigate to: `http://172.26.81.221:5173`
   - Login with credentials above
   - **No MongoDB or backend installation required!**

### 🔥 Firewall Configuration (If Needed)

If your friend can't access the application, you may need to configure Windows Firewall:

**Option 1: Quick Method (PowerShell as Administrator)**
```powershell
New-NetFirewallRule -DisplayName "Hackathon Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Hackathon Frontend" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
```

**Option 2: Manual Method**
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" → Enter port: 5000 → Next
6. Select "Allow the connection" → Next
7. Check all profiles → Next
8. Name it "Hackathon Backend" → Finish
9. Repeat steps 3-8 for port 5173 (name it "Hackathon Frontend")

### 🧪 Testing Connection

**From Friend's Computer:**
1. Open browser and go to: `http://172.26.81.221:5173`
2. You should see the login page
3. Enter credentials: `admin@hackathon.com` / `admin123`
4. Click "Sign In"
5. You should see the Kanban board!

### ❌ Troubleshooting

**"Cannot connect to server"**
- Check both computers are on same WiFi/network
- Verify firewall rules are added
- Make sure both servers (backend & frontend) are running

**"Failed to fetch"**
- Clear browser cache and reload
- Check your computer's IP hasn't changed (run `ipconfig`)
- Restart both servers

**"Invalid credentials"**
- Double-check email and password (case-sensitive)
- Use credentials listed above

### 📱 Network Requirements

- Both computers must be on the **same network**
- No VPN should be active
- No MongoDB installation needed on friend's computer
- Friend only needs a modern web browser

### 🚀 Features Available

Once logged in, your friend can:
- View and manage Kanban board
- Create, edit, and delete tasks
- Drag & drop tasks between columns
- View admin dashboard (if logged in as admin)
- Real-time team messaging
- View database information (admin only)

---

**Note:** If your computer's IP address changes (after restart or network change), you'll need to update the frontend code with the new IP address.
