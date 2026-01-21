# ✅ QR CODE MANAGEMENT - TEST CHECKLIST

**Date:** January 18, 2026  
**Tester:** Quality Assurance  
**Environment:** Development/Testing

---

## 📋 Pre-Testing Setup

Before starting tests, verify:

```
□ Backend server running (npm start in /backend)
  Port: 3001
  Status: Check with: curl http://localhost:3001/api/menu

□ Frontend server running (npm start in /frontend)
  Port: 3000
  URL: http://localhost:3000

□ Database connected
  MySQL running on localhost:3306
  Database: mrbeast_db

□ Menu data seeded
  Verify: 50 items in database

□ Browser ready
  Chrome, Firefox, or Edge
  JavaScript enabled
  Cookies enabled

□ Mobile device ready (optional)
  Phone with camera
  QR scanner app installed
```

---

## 🎯 Test Case 1: Component Loading

**Objective:** Verify QR Management page loads correctly

### Test Steps:

```
1. Navigate to Admin section
2. Click on "QR Management" menu item
3. Wait for page to load (max 3 seconds)
```

### Expected Results:

```
✓ Page loads without errors
✓ "QR Ordering System Management" title displays
✓ Two main sections visible:
  - Generate QR Code (left)
  - Menu Preview (right)
✓ Table Number input field visible and editable
✓ QR code container displays "Loading QR code generator..."
✓ Download QR button present and disabled
✓ Test QR button present and disabled
```

### Actual Results:

```
□ Page loads: _______
□ Title displays: _______
□ Sections visible: _______
□ Input field works: _______
□ Container shows: _______
□ Buttons disabled: _______

Pass: □ Fail: □
Notes: _________________________________
```

---

## 🎯 Test Case 2: QR Generation - Single Table

**Objective:** Generate QR code for Table 1

### Test Steps:

```
1. Table number input shows "1" by default
2. Wait 2 seconds for QR generation
3. Observe QR code container
4. Verify QR code appears
```

### Expected Results:

```
✓ QR code generates in container
✓ QR code is square (256x256px)
✓ QR code has black pattern on white background
✓ QR code is centered
✓ Download QR button becomes enabled
✓ Test QR button becomes enabled
✓ No error messages appear
```

### Actual Results:

```
□ QR generates: _______
□ Correct size: _______
□ Colors correct: _______
□ Centered: _______
□ Buttons enabled: _______
□ No errors: _______

Pass: □ Fail: □
Notes: _________________________________
```

---

## 🎯 Test Case 3: QR Generation - Different Tables

**Objective:** Generate QR codes for various table identifiers

### Test Steps:

#### 3a: Table "2"

```
1. Clear table number field
2. Type "2"
3. Wait for QR generation
4. Note the generated QR code
```

**Expected:** Different QR code from Table 1

```
□ QR generated: _______
□ Different from Table 1: _______
Pass: □ Fail: □
```

#### 3b: Table "10"

```
1. Clear and enter "10"
2. Wait for generation
3. Compare with Table 2 QR
```

**Expected:** Unique QR code for Table 10

```
□ QR generated: _______
□ Unique pattern: _______
Pass: □ Fail: □
```

#### 3c: Table "Takeaway"

```
1. Clear and enter "Takeaway"
2. Wait for generation
```

**Expected:** QR generates with text input

```
□ QR generated: _______
□ Text accepted: _______
Pass: □ Fail: □
```

#### 3d: Table "VIP-1"

```
1. Clear and enter "VIP-1"
2. Wait for generation
```

**Expected:** Special characters accepted

```
□ QR generated: _______
□ Special chars work: _______
Pass: □ Fail: □
```

---

## 🎯 Test Case 4: Download QR Code Functionality

**Objective:** Download QR codes as image files

### Test Steps:

```
1. Generate QR for Table "1"
2. Verify Download QR button is enabled
3. Click "Download QR" button
4. Check browser downloads folder
5. Verify file downloaded
```

### Expected Results:

```
✓ Click triggers download
✓ File name: "table-1-qrcode.png"
✓ File downloads to Downloads folder
✓ File size > 1KB (valid image)
✓ File can be opened in image viewer
✓ QR code visible in downloaded file
✓ No pop-ups or dialogs
```

### Actual Results:

```
□ Download triggered: _______
□ File name correct: _______
□ File location: _________
□ File size: _____ KB
□ Can open image: _______
□ QR visible: _______

Pass: □ Fail: □
Notes: _________________________________
```

### 4b: Download Multiple QR Codes

```
1. Generate QR for Table "2"
2. Download (should be table-2-qrcode.png)
3. Generate QR for Table "5"
4. Download (should be table-5-qrcode.png)
5. Verify all files in Downloads folder
```

**Expected:** Different files for each table

```
□ Table 2 downloaded: _______
□ Table 5 downloaded: _______
□ File names correct: _______
□ All files present: _______

Pass: □ Fail: □
```

---

## 🎯 Test Case 5: Test QR Functionality

**Objective:** Verify "Test QR" button opens correct URL

### Test Steps:

```
1. Generate QR for Table "1"
2. Click "Test QR" button
3. New window/tab should open
4. Wait for page to load
```

### Expected Results:

```
✓ New tab opens (not new window)
✓ URL is: http://192.168.1.34:3000?tab=qr-ordering&tableId=1
✓ Page loads (QR ordering page)
✓ Title shows "QR Code Ordering for 1"
✓ Menu displays with items
✓ Shopping cart visible
✓ "Place Order" button visible
✓ No errors on page
```

### Actual Results:

```
□ New tab opens: _______
□ URL correct: _______________
□ Page loads: _______
□ Title shows Table 1: _______
□ Menu visible: _______
□ Cart visible: _______
□ All elements present: _______

Pass: □ Fail: □
Notes: _________________________________
```

### 5b: Test QR for Different Tables

```
1. Go back to QR Management
2. Enter Table "5"
3. Wait for QR
4. Click "Test QR"
5. Verify URL has tableId=5
6. Verify page shows "Table 5"
```

**Expected:** Correct table number in URL and page

```
□ URL has tableId=5: _______
□ Page shows Table 5: _______

Pass: □ Fail: □
```

---

## 🎯 Test Case 6: Menu Preview

**Objective:** Verify menu displays correctly in QR Management page

### Test Steps:

```
1. Scroll down to "Menu Preview" section
2. Observe menu items displayed
3. Check categories
4. Verify prices
```

### Expected Results:

```
✓ Menu items load successfully
✓ Items grouped by category:
  - Starters
  - Main Course
  - Desserts
  - Beverages
  - Salads
✓ Each item shows:
  - Item name
  - Description
  - Price (with ₹ symbol)
✓ Prices are correct
✓ Can scroll through menu
✓ 50 total items visible (across categories)
```

### Actual Results:

```
□ Menu loads: _______
□ Categories visible: _______
  □ Starters: _______
  □ Main Course: _______
  □ Desserts: _______
  □ Beverages: _______
  □ Salads: _______

□ Item details shown: _______
□ Prices correct: _______
□ Total items: _____

Pass: □ Fail: □
Notes: _________________________________
```

---

## 🎯 Test Case 7: Mobile Responsiveness

**Objective:** Verify QR Management works on mobile devices

### Test Steps:

```
1. Open QR Management on mobile browser
2. Zoom out to see full page
3. Test all functionality
4. Check orientation (portrait & landscape)
```

### Expected Results (Portrait Mode):

```
✓ Page loads correctly
✓ QR code container visible
✓ Table input accessible
✓ Download button works
✓ Test QR button works
✓ Menu visible below (scrollable)
✓ No horizontal scroll needed
```

### Expected Results (Landscape Mode):

```
✓ Layout adjusts properly
✓ QR code visible on left
✓ Menu visible on right (or below)
✓ All buttons accessible
✓ Touch-friendly button sizes
```

### Actual Results:

```
□ Portrait mode works: _______
□ Landscape mode works: _______
□ All functions work: _______
□ Layout responsive: _______
□ Touch-friendly: _______

Pass: □ Fail: □
Notes: _________________________________
```

---

## 🎯 Test Case 8: Error Handling

**Objective:** Verify error handling works correctly

### 8a: Download When QR Not Ready

```
1. Don't generate QR (clear table input)
2. Try to click "Download QR"
3. Verify button is disabled
```

**Expected:** Button disabled, no error

```
□ Button disabled: _______
Pass: □ Fail: □
```

### 8b: Test QR When QR Not Ready

```
1. Clear table input
2. Try to click "Test QR"
3. Verify button is disabled
```

**Expected:** Button disabled, no error

```
□ Button disabled: _______
Pass: □ Fail: □
```

### 8c: Network Error (Optional)

```
1. Disconnect internet (or throttle connection)
2. Try to load QR Management
3. Check if component handles error gracefully
```

**Expected:** Error message or fallback

```
□ Error handled: _______
□ User informed: _______
Pass: □ Fail: □
```

---

## 🎯 Test Case 9: QR Scanning

**Objective:** Verify QR codes can be scanned (Mobile Test)

### Prerequisites:

```
□ Mobile device with camera
□ QR scanner app (or use native camera)
□ Downloaded QR code OR QR displayed on screen
```

### Test Steps:

```
1. Print or display QR code for Table "1"
2. Open QR scanner on mobile
3. Point camera at QR code
4. Scan the code
5. Wait for redirect
```

### Expected Results:

```
✓ QR scans successfully
✓ Opens: http://192.168.1.34:3000?tab=qr-ordering&tableId=1
✓ Page loads with menu
✓ Shows "QR Code Ordering for 1"
✓ Can browse menu
✓ Can add items to cart
✓ Can place order
```

### Actual Results:

```
□ QR scans: _______
□ Opens correct URL: _______
□ Page loads: _______
□ Table number correct: _______
□ Can order: _______

Pass: □ Fail: □
Notes: _________________________________
```

### 9b: Scan Multiple QR Codes

```
1. Scan Table 1 QR → Verify shows Table 1
2. Scan Table 5 QR → Verify shows Table 5
3. Scan Takeaway QR → Verify shows Takeaway
4. Verify no mixing of table numbers
```

**Expected:** Each QR shows correct table

```
□ Table 1: _______
□ Table 5: _______
□ Takeaway: _______
□ No mixing: _______

Pass: □ Fail: □
```

---

## 🎯 Test Case 10: End-to-End QR Ordering Flow

**Objective:** Complete customer flow from QR scan to order

### Test Steps:

```
1. Scan Table 1 QR
2. Menu loads and shows "Table 1"
3. Add items:
   - 2x Starters Item 1 (₹55 each)
   - 1x Main Course Item 1 (₹105)
4. Verify cart total: ₹215
5. Click "Place Order"
6. Verify order created with Table 1
7. Check Dine-In Management
8. Verify order shows "Table 1"
9. Process payment
10. Mark delivery complete
```

### Expected Results:

```
✓ QR opens ordering page
✓ Table number displayed correctly
✓ Menu shows all items
✓ Items add to cart correctly
✓ Cart calculates total correctly
✓ Order placed successfully
✓ Waiter sees order with Table 1
✓ Waiter can mark delivery complete
✓ Table becomes available
✓ No data corruption
✓ Table number NOT mixed with other tables
```

### Actual Results:

```
□ QR opens page: _______
□ Table shown: _______
□ Items add: _______
□ Total correct: _______
□ Order placed: _______
□ Waiter sees: _______
□ Table correct: _______
□ Complete: _______

Pass: □ Fail: □
Notes: _________________________________
```

---

## 🎯 Test Case 11: Batch QR Generation

**Objective:** Generate multiple QR codes in sequence

### Test Steps:

```
1. Generate QR for Table 1 → Download
2. Generate QR for Table 2 → Download
3. Generate QR for Table 3 → Download
4. Verify all 3 files downloaded
5. Verify file names:
   - table-1-qrcode.png
   - table-2-qrcode.png
   - table-3-qrcode.png
6. Verify QR codes are different
```

### Expected Results:

```
✓ All 3 QR codes generate
✓ All download successfully
✓ File names correct
✓ Files different (different QR patterns)
✓ No file conflicts/overwrites
```

### Actual Results:

```
□ Table 1 QR: _______
□ Table 2 QR: _______
□ Table 3 QR: _______
□ All files present: _______
□ Names correct: _______
□ All unique: _______

Pass: □ Fail: □
Notes: _________________________________
```

---

## 📊 Test Results Summary

### Overall Results:

| Test Case                   | Status | Pass | Fail | Notes |
| --------------------------- | ------ | ---- | ---- | ----- |
| 1. Component Loading        | □      | □    | □    |       |
| 2. QR Generation (Single)   | □      | □    | □    |       |
| 3. QR Generation (Multiple) | □      | □    | □    |       |
| 4. Download Functionality   | □      | □    | □    |       |
| 5. Test QR Button           | □      | □    | □    |       |
| 6. Menu Preview             | □      | □    | □    |       |
| 7. Mobile Responsiveness    | □      | □    | □    |       |
| 8. Error Handling           | □      | □    | □    |       |
| 9. QR Scanning              | □      | □    | □    |       |
| 10. End-to-End Flow         | □      | □    | □    |       |
| 11. Batch Generation        | □      | □    | □    |       |

### Score: **\_** / 11 Tests Passed

---

## 🎯 Issues Found

### Critical Issues:

```
1. Issue: _________________________________
   Severity: Critical
   Fix Required: Yes
   Status: □ Open □ Fixed

2. Issue: _________________________________
   Severity: Critical
   Fix Required: Yes
   Status: □ Open □ Fixed
```

### Major Issues:

```
1. Issue: _________________________________
   Severity: Major
   Impact: _______
   Status: □ Open □ Fixed
```

### Minor Issues:

```
1. Issue: _________________________________
   Severity: Minor
   Workaround: _______
   Status: □ Open □ Fixed
```

---

## ✅ Sign-Off

```
Testing Completed: □ Yes □ No

Total Tests Run: _____
Tests Passed: _____
Tests Failed: _____
Pass Rate: _____%

Overall Status:
□ PASS - Ready for production
□ CONDITIONAL PASS - Minor issues found
□ FAIL - Critical issues must be fixed

Tester Name: ___________________
Date: ___________________
Signature: ___________________

Reviewed By: ___________________
Date: ___________________
Signature: ___________________
```

---

## 📝 Additional Notes

```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

---

**Print this checklist and complete all tests before deployment!**
