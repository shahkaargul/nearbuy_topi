# NearBuy - Hyper-local E-commerce Platform

A production-ready, modular frontend for a hyper-local e-commerce platform built for GIKI/Topi community.

## 🚀 Features

- **Browse Local Stores**: Restaurants, Grocery Stores, and Stationery Shops
- **Product Catalog**: View products from each store
- **Shopping Cart**: Add items with persistent localStorage
- **Order Processing**: Automated email notifications and WhatsApp integration
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Commission Tracking**: Automatic 10% commission calculation for admin

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern design with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Native modules, no build tools required
- **EmailJS**: Email notification service
- **WhatsApp Business API**: Direct order coordination

## 📁 Project Structure

```
/nearbuy-project
  ├─ index.html              (Main application shell)
  ├─ README.md               (This file)
  ├─ /css
  │   ├─ main.css            (Design system & global styles)
  │   └─ components.css      (Component-specific styles)
  ├─ /js
  │   ├─ db.js               (Mock database - stores & products)
  │   ├─ app.js              (Main controller & DOM manipulation)
  │   ├─ cart.js             (Cart logic & localStorage)
  │   └─ emailService.js     (EmailJS integration)
  └─ /assets                 (Images - currently using placeholders)
```

## 🎨 Design System

- **Primary Color**: Emerald Green (#2ecc71)
- **Secondary Color**: Deep Sky Blue (#3498db)
- **Typography**: Inter (Google Fonts)
- **Layout**: CSS Grid (Mobile-first responsive)

## ⚙️ Setup Instructions

### 1. Clone or Download

Clone this repository or download the files to your local machine.

### 2. Configure EmailJS

1. Create a free account at [EmailJS](https://www.emailjs.com/)
2. Create two email templates:
   - **Customer Template**: Order confirmation for customers
   - **Admin Template**: New order notification with commission details
3. Update `js/emailService.js` with your credentials:

```javascript
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',
  customerTemplateId: 'YOUR_CUSTOMER_TEMPLATE_ID',
  adminTemplateId: 'YOUR_ADMIN_TEMPLATE_ID',
  publicKey: 'YOUR_PUBLIC_KEY'
};
```

### 3. Update Store Data

Edit `js/db.js` to add your actual stores and products. Replace WhatsApp numbers with real business numbers.

### 4. Deploy to GitHub Pages

#### Option A: Using Git Commands

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - NearBuy platform"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

#### Option B: Using GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository
3. Select the `nearbuy-project` folder
4. Publish repository to GitHub

#### Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Navigate to **Pages** (in the sidebar)
4. Under **Source**, select `main` branch
5. Click **Save**
6. Your site will be published at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## 📱 Usage

### For Customers

1. **Browse Stores**: Filter by category (All, Restaurant, Grocery, Stationery)
2. **View Products**: Click on a store to see available products
3. **Add to Cart**: Click "Add to Cart" on desired products
4. **Checkout**: 
   - Click the cart icon
   - Review your items
   - Click "Proceed to Checkout"
   - Fill in your details (Name, Hostel/Location, Email)
   - Click "Confirm Order"
5. **Complete Order**: 
   - WhatsApp will open with order details
   - Send the message to the store
   - You'll receive a confirmation email

### For Store Owners

- Receive orders via WhatsApp
- Get order details including customer info and items

### For Admins

- Receive email notifications for all orders
- Track commission (10% of each order)

## 🔧 Customization

### Adding Stores

Edit `js/db.js`:

```javascript
{
  id: 9,
  name: "Your Store Name",
  category: "Restaurant", // or "Grocery" or "Stationery"
  whatsappNumber: "923001234567",
  imageUrl: "https://placehold.co/400x300/2ecc71/ffffff?text=Your+Store"
}
```

### Adding Products

```javascript
{
  id: 901,
  storeId: 9, // Match with store ID
  name: "Product Name",
  price: 299,
  imageUrl: "https://placehold.co/300x300/2ecc71/ffffff?text=Product"
}
```

### Changing Colors

Edit CSS variables in `css/main.css`:

```css
:root {
  --color-primary: #2ecc71;
  --color-secondary: #3498db;
  /* ... */
}
```

## 🐛 Troubleshooting

### Modules not loading

- Ensure all import statements include `.js` extension
- Check browser console for errors
- Verify file paths are correct

### GitHub Pages not working

- Ensure repository is public
- Check that Pages is enabled in Settings
- Wait 5-10 minutes for deployment
- Clear browser cache

### EmailJS not sending

- Verify credentials are correct
- Check EmailJS dashboard for quota
- Ensure templates are properly configured

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ for GIKI/Topi Community**
