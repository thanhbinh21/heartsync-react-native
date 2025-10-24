# 🧪 Test API Login - Troubleshooting Guide

## Lỗi: 401 Unauthorized

### Các Nguyên Nhân Có Thể:

1. **Username/Password sai**
   - Backend expect: `admin` / `admin`
   - Check xem có đúng không

2. **Backend chưa chạy**
   - Check backend có chạy ở port 5000 không
   - Test: `http://192.168.1.31:5000/api/auth/login`

3. **Request format sai**
   - Backend expect: `{ "username": "admin", "password": "admin" }`
   - Check JSON stringify có đúng không

4. **IP address sai**
   - Check IP trong `src/config/api.ts`
   - Phải là IP của máy chạy backend

5. **CORS issues** (nếu test trên web)
   - React Native không có CORS issues
   - Nhưng nếu test trên browser thì có thể bị

---

## 🔧 Cách Debug

### 1. Test Backend Directly (PowerShell)

```powershell
# Test 1: Check backend is running
curl http://192.168.1.31:5000/api/auth/login

# Test 2: Try login
curl.exe -X POST http://192.168.1.31:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"admin\"}'
```

### 2. Check Console Logs

Với logging đã thêm vào api-client.ts, bạn sẽ thấy:
```
🌐 API Request: { method, url, body, headers }
📥 API Response: { status, ok, data }
```

**Check:**
- URL có đúng không?
- Body có format đúng không?
- Response message là gì?

### 3. Test với Postman

1. Open Postman
2. Create new POST request
3. URL: `http://192.168.1.31:5000/api/auth/login`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "username": "admin",
  "password": "admin"
}
```
6. Send - Xem response

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend không response hoặc timeout
**Solution:**
- Check backend có chạy không: `netstat -ano | findstr :5000`
- Restart backend
- Check firewall

### Issue 2: IP address wrong
**Solution:**
```bash
# Get your IP
ipconfig
# Look for "IPv4 Address" của WiFi/Ethernet adapter
# Update trong src/config/api.ts
```

### Issue 3: Request body sai format
**Check trong console log:**
```javascript
// Should see:
body: "{\"username\":\"admin\",\"password\":\"admin\"}"

// NOT:
body: "username=admin&password=admin"
```

### Issue 4: Backend API changed
**Check backend code:**
- Endpoint có phải `/api/auth/login`?
- Method có phải POST?
- Body format expected?

---

## 📝 Checklist Debug Steps

- [ ] 1. Check backend đang chạy (port 5000)
- [ ] 2. Test với curl/Postman - confirm backend works
- [ ] 3. Check IP address trong api.ts
- [ ] 4. Check console logs trong Metro bundler
- [ ] 5. Check username/password đúng chưa
- [ ] 6. Check request body format (JSON stringify)
- [ ] 7. Try with different test accounts
- [ ] 8. Clear AsyncStorage và try again

---

## 🚀 Quick Fix Commands

### Clear AsyncStorage (if needed)
Add this to LoginScreen temporarily:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Add button
<TouchableOpacity onPress={async () => {
  await AsyncStorage.clear();
  Alert.alert('Cleared', 'AsyncStorage cleared');
}}>
  <Text>Clear Storage</Text>
</TouchableOpacity>
```

### Check current IP
```powershell
ipconfig | findstr IPv4
```

### Restart Metro bundler
```bash
# Press R in terminal
# Or Ctrl+C and restart
npm start
```

---

## 📞 Expected Backend Response

**Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "670d...",
    "username": "admin",
    "profile": { ... },
    "subscription": "premium",
    "verified": true
  }
}
```

**Fail (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Fail (400):**
```json
{
  "success": false,
  "message": "Username and password are required"
}
```

---

## 💡 Next Steps After Fixing

1. ✅ Login works
2. Test token saved to AsyncStorage
3. Test navigation to Swipe screen
4. Test other API endpoints
5. Continue with Phase 2 (Swipe screen)

---

**Need Help?**
- Check Metro bundler console for detailed logs
- Check backend terminal/logs
- Use React Native Debugger
