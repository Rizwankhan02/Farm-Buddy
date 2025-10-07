# 🔧 Seller/Admin Dashboard Debug Guide

## 🚨 **Issue**: Products not showing in dashboard for seller who is also admin

## 🧪 **Step-by-Step Testing & Debugging**

### **Step 1: Open Browser Console**
1. Open Chrome/Firefox Developer Tools (F12)
2. Go to the Console tab
3. Keep it open during testing to see debug messages

### **Step 2: Clear All Data (Fresh Start)**
```javascript
// In browser console, run these commands:
sellerAPI.clearMockData();
localStorage.clear();
// Then refresh the page
```

### **Step 3: Test Authentication**

#### **For Seller/Admin User:**
```
Email: seller@admin.com
Password: any password
```
This should give you:
- userType: 'SELLER'
- isadmin: true
- farmerId: 1

#### **For Regular Seller:**
```
Email: seller@test.com
Password: any password
```
This should give you:
- userType: 'SELLER'
- isadmin: false
- farmerId: 1

### **Step 4: Debug Current State**
```javascript
// In browser console after login:
sellerAPI.debugState();
```

This will show:
- Current mockProducts array
- localStorage products
- Current user data
- Product IDs

### **Step 5: Reset Test Data**
```javascript
// If no products showing, reset test data:
sellerAPI.resetTestData();
// Then refresh the page
```

### **Step 6: Add a Product Manually**
1. Go to "Add New Product"
2. Fill in:
   - Name: "Test Product"
   - Category: "Vegetables"
   - Quantity: 10
   - Price: 50
   - Description: "Test description"
3. Click "Add Product"

### **Step 7: Check What Happened**
```javascript
// In console after adding product:
sellerAPI.debugState();
console.log('Current user:', JSON.parse(localStorage.getItem('user')));
```

## 🔍 **Common Issues & Fixes**

### **Issue 1: FarmerId Mismatch**
**Symptoms**: Products exist but don't show for logged-in user
**Debug**:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('User farmerId:', user.farmerId);

const products = JSON.parse(localStorage.getItem('mockProducts'));
console.log('Product farmerIds:', products.map(p => p.farmerId));
```

**Fix**: Ensure both user.farmerId and product.farmerId are the same number (1)

### **Issue 2: Data Type Mismatch**
**Symptoms**: Filtering fails due to string vs number comparison
**Debug**: Check if farmerId is stored as string or number
**Fix**: Already implemented parseInt() in the filtering

### **Issue 3: Empty localStorage**
**Symptoms**: No products in localStorage
**Debug**:
```javascript
console.log('localStorage mockProducts:', localStorage.getItem('mockProducts'));
```
**Fix**: Run `sellerAPI.resetTestData()`

### **Issue 4: User Not Logged In**
**Symptoms**: Dashboard shows but no user context
**Debug**:
```javascript
console.log('Current user:', JSON.parse(localStorage.getItem('user')));
```
**Fix**: Re-login with proper credentials

## 🎯 **Expected Behavior**

### **After Login:**
- User object should have farmerId: 1
- Dashboard should load with "Loading..." then show products
- Console should show API fallback messages

### **In Dashboard:**
- Should see "My Products" section
- Should show count in stats (Total Products, In Stock, etc.)
- Should see product cards/table with 2-3 default products

### **Adding Products:**
- Should redirect back to dashboard
- New product should appear in list
- Total count should increase

## 🚀 **Quick Test Commands**

```javascript
// 1. Clear everything and start fresh
sellerAPI.clearMockData();
localStorage.clear();

// 2. Reset with test data
sellerAPI.resetTestData();

// 3. Check current state
sellerAPI.debugState();

// 4. Check user
console.log('User:', JSON.parse(localStorage.getItem('user')));

// 5. Manually trigger product load for farmerId 1
sellerAPI.getProducts(1).then(result => console.log('Products:', result.data));
```

## 🔧 **Advanced Debugging**

### **Check Network Tab:**
1. Go to Network tab in DevTools
2. Try to access dashboard
3. Look for failed API calls to `/seller/products/1`
4. Should see fallback to mock data in console

### **Check Application Tab:**
1. Go to Application tab
2. Look at Local Storage
3. Should see `mockProducts` and `nextProductId` keys

### **Manual Product Addition:**
```javascript
// Add a product manually via console
const testProduct = {
  stockItem: "Manual Test Product",
  quantity: 15,
  pricePerUnit: 75,
  category: "Test Category",
  description: "Added via console",
  imagePath: ""
};

sellerAPI.addProduct(1, testProduct).then(result => {
  console.log('Product added:', result);
  // Then refresh the page to see it
});
```

## 📋 **Troubleshooting Checklist**

- [ ] Browser console is open and showing debug messages
- [ ] User is logged in (check localStorage 'user' key)
- [ ] User has farmerId: 1
- [ ] mockProducts exists in localStorage
- [ ] Products have farmerId: 1
- [ ] No JavaScript errors in console
- [ ] Page has fully loaded (not stuck on loading screen)

## 🎮 **Test Credentials**

| Email | Password | UserType | IsAdmin | FarmerId |
|-------|----------|----------|---------|----------|
| seller@test.com | any | SELLER | false | 1 |
| seller@admin.com | any | SELLER | true | 1 |
| farmer@test.com | any | SELLER | false | 1 |
| admin@test.com | any | ADMIN | true | 1 |

All these should work and show the same products (farmerId: 1).

---

**If products still don't show after following this guide, please share the console output from `sellerAPI.debugState()` so I can help further!**
