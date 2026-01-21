# 🚀 QR MANAGEMENT - QUICK TEST GUIDE

**Fast execution guide for testing QR functionality**

---

## ⚡ 5-Minute Quick Test

### Before Starting:

```
✓ Backend running on port 3001 (npm start in /backend)
✓ Frontend running on port 3000 (npm start in /frontend)
✓ Browser open to admin section
```

### Test Steps:

1. **Navigate to QR Management**

   ```
   Admin → QR Management (or Sidebar menu)
   ```

2. **Test QR Generation**

   ```
   Current table: 1 (default)
   Wait 2 seconds
   ✓ See QR code displayed (black square on white)
   ✓ See Download button enabled (orange)
   ✓ See Test QR button enabled (blue)
   ```

3. **Test Different Table Numbers**

   ```
   Change to: "2"
   ✓ New QR generates (different pattern)

   Change to: "5"
   ✓ Another new QR (different pattern)

   Change to: "Takeaway"
   ✓ QR generates (accepts text)
   ```

4. **Test Download**

   ```
   Set table: "1"
   Click: Download QR
   ✓ File downloads: table-1-qrcode.png
   ✓ Check Downloads folder
   ✓ File size > 1KB
   ```

5. **Test QR Opening**

   ```
   Set table: "1"
   Click: Test QR
   ✓ New tab opens
   ✓ See page: "QR Code Ordering for 1"
   ✓ Menu visible
   ✓ Shopping cart visible
   ```

6. **Check Menu Preview**
   ```
   Scroll down right side
   ✓ See menu items (50 items)
   ✓ Grouped by category
   ✓ Prices shown (₹ symbol)
   ```

### Result: ✅ PASS/❌ FAIL

---

## 📱 10-Minute Mobile Test

### Requirements:

```
✓ Mobile phone or tablet
✓ Phone connected to same network
✓ Mobile browser open
```

### Test Steps:

1. **Navigate on Mobile**

   ```
   Open: http://192.168.1.34:3000 (on mobile)
   Login as admin
   Go to: QR Management
   ```

2. **Portrait Mode**

   ```
   ✓ Page loads correctly
   ✓ QR generates in center
   ✓ Input field works (tap to enter)
   ✓ Download button works (tap)
   ✓ Test QR button works (tap)
   ```

3. **Landscape Mode**

   ```
   Rotate phone to landscape
   ✓ Layout adjusts
   ✓ All elements visible
   ✓ Buttons still accessible
   ```

4. **Generate 3 QR Codes**
   ```
   Set table: "1" → Generate → Works: ✓/✗
   Set table: "2" → Generate → Works: ✓/✗
   Set table: "3" → Generate → Works: ✓/✗
   ```

### Result: ✅ PASS/❌ FAIL

---

## 📸 15-Minute QR Scanning Test

### Requirements:

```
✓ Mobile phone with camera
✓ QR scanner app or native camera
✓ Desktop with QR Management open
```

### Test Steps:

1. **Generate QR for Table 1**

   ```
   Desktop QR Management
   Set table: "1"
   ✓ QR displays on screen
   ```

2. **Scan QR Code**

   ```
   Mobile phone:
   - Open QR scanner or camera
   - Point at desktop screen showing QR
   - Scan the code
   ```

3. **Verify Redirect**

   ```
   ✓ Opens URL: http://192.168.1.34:3000?tab=qr-ordering&tableId=1
   ✓ Page shows: "QR Code Ordering for 1"
   ✓ Menu displays
   ✓ Shopping cart visible
   ```

4. **Test Multiple Tables**

   ```
   Desktop: Set to Table "2" → Scan
   Mobile: Should show "QR Code Ordering for 2"

   Desktop: Set to Table "5" → Scan
   Mobile: Should show "QR Code Ordering for 5"
   ```

### Result: ✅ PASS/❌ FAIL

---

## 🛒 20-Minute End-to-End Test

### Requirements:

```
✓ Both browsers (desktop for admin, mobile for customer)
✓ Admin logged in
✓ Menu loaded
✓ Tables configured
```

### Test Steps:

1. **Admin Side: Generate QR**

   ```
   Desktop - QR Management
   Set table: "1"
   Generate QR
   ```

2. **Customer Side: Scan QR**

   ```
   Mobile - Scan QR for Table 1
   Page loads: "QR Code Ordering for 1"
   ```

3. **Customer: Add Items**

   ```
   Mobile - Browse menu
   Add: 2x Starters Item 1
   Add: 1x Main Course Item 1
   Cart total: ₹215
   ```

4. **Customer: Place Order**

   ```
   Mobile - Click "Place Order"
   ✓ Order submitted
   ✓ Success message
   ```

5. **Admin: Check Order**

   ```
   Desktop - Go to: Dine-In Management
   ✓ See order for Table 1
   ✓ Shows 2x Starters, 1x Main Course
   ✓ Total: ₹215
   ✓ Status: pending
   ```

6. **Complete Flow**
   ```
   Desktop - Click "Mark Available"
   ✓ Order completed
   ✓ Table 1 available again
   ✓ Order removed from active list
   ```

### Result: ✅ PASS/❌ FAIL

---

## ✅ Quick Verification Checklist

### Component Functionality:

- [ ] QR generates for Table 1
- [ ] QR generates for Table 2
- [ ] QR generates for "Takeaway"
- [ ] Download button works
- [ ] Test QR button opens new tab
- [ ] URL has correct tableId
- [ ] Menu preview shows 50 items
- [ ] Mobile responsive
- [ ] Error handling works
- [ ] QR scans correctly

### Data Integrity:

- [ ] Each table gets unique QR
- [ ] Correct table number in URL
- [ ] Order saved with correct table
- [ ] No mixing of table numbers
- [ ] Multiple simultaneous orders work
- [ ] Payment linked to correct table

### UX/UI:

- [ ] Buttons enable/disable correctly
- [ ] Error messages display
- [ ] Page loads quickly (<3 sec)
- [ ] Responsive on mobile
- [ ] Touch-friendly buttons
- [ ] Clear instructions

---

## 📊 Scoring

**Total Tests: 10**

If passes:

- 10/10 = ✅ **PRODUCTION READY**
- 8-9/10 = ⚠️ **MINOR ISSUES** - Fix then retest
- 6-7/10 = 🔴 **MAJOR ISSUES** - Must fix before deployment
- <6/10 = 🔴 **NOT READY** - Fix critical issues

---

## 🐛 Common Issues & Fixes

### Issue 1: "Loading QR code generator..." stays

**Cause:** qrcodejs library not loaded  
**Fix:** Refresh page, clear cache  
**Status:** Check browser console (F12)

### Issue 2: QR not showing

**Cause:** Table input is empty  
**Fix:** Enter "1" in table field  
**Status:** Watch for real-time generation

### Issue 3: Download doesn't work

**Cause:** Browser blocking download  
**Fix:** Check browser permissions  
**Status:** Check browser download settings

### Issue 4: "Test QR" opens blank page

**Cause:** IP address mismatch (using localhost)  
**Fix:** Use 192.168.1.34 instead  
**Status:** Check BASE_QR_ORDER_URL in code

### Issue 5: Menu not showing

**Cause:** API not responding  
**Fix:** Check backend is running  
**Status:** Test: http://localhost:3001/api/menu

---

## 🎯 Success Criteria

### All tests pass if:

1. ✅ QR generates in <2 seconds
2. ✅ Download creates valid PNG file
3. ✅ Test QR opens correct URL
4. ✅ URL has correct tableId parameter
5. ✅ Page shows correct table number
6. ✅ Menu loads with 50 items
7. ✅ Mobile version responsive
8. ✅ QR can be scanned
9. ✅ Order saved with correct table
10. ✅ No errors in console

---

## 🚀 Next Steps

After all tests pass:

1. [ ] Document any issues found
2. [ ] Report results
3. [ ] Fix any issues
4. [ ] Retest critical paths
5. [ ] Approve for production
6. [ ] Deploy to live server
7. [ ] Train staff

---

**Ready to test? Start with the 5-Minute Quick Test! ⚡**

Print this page for reference while testing.
