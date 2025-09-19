# Invenza

Invenza is a modern, full-stack inventory management system built with Next.js to help businesses efficiently manage their products, orders, and customers. This application provides a user-friendly dashboard for tracking inventory levels, processing orders, and generating insightful reports.

## 🚀 Features

- **Product Management**: Add, edit, and view your product catalog with real-time stock tracking.
- **Order Processing**: Create and manage customer orders with an intuitive interface.
- **Customer Management**: Maintain a database of your customers with their contact details and order history.
- **Reporting**: Generate comprehensive reports on sales, products, and customer analytics to make data-driven decisions.
- **User Authentication**: Secure login and registration system to protect your business data.
- **Responsive Design**: Access your dashboard from any device, thanks to our mobile-first approach.

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js 15](https://nextjs.org/) - The React framework for production.
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible UI components.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icons.
- **Authentication**: Next.js built-in authentication with custom backend routes.
- **State Management**: React hooks for local state management.
- **Form Handling**: React Hook Form with Zod validation for efficient and type-safe forms.
- **Database**: MongoDB (implied by models structure) - A flexible NoSQL database.
- **Backend APIs**: Next.js API Routes for building serverless backend functions.

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AhnafFarhanHossain/Invenza.git
   cd Invenza
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser and navigate to** [http://localhost:3000](http://localhost:3000) **to see the application.**

## 📂 Project Structure

```
invenza/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── dashboard/     # Dashboard-related APIs
│   │   ├── orders/        # Order management APIs
│   │   ├── products/      # Product management APIs
│   │   └── reports/       # Report generation APIs
│   ├── auth/              # Authentication pages (signin, register)
│   ├── dashboard/         # Dashboard pages and layouts
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard-specific components
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and configurations
│   └── db/                # Database connection helpers
├── models/                # Data models for MongoDB
└── public/                # Static assets
```

## 📚 Core Functionality

### Product Management
- Add new products with details like name, description, price, and stock quantity.
- Edit existing product information.
- View all products in a searchable table.
- Low stock alerts to help with inventory replenishment.

### Order Processing
- Create new orders by selecting products and quantities.
- View order details including customer information and itemized lists.
- Track order status (e.g., pending, fulfilled, cancelled).
- Access order history for quick reference.

### Customer Management
- Register new customers with their contact details.
- View and edit customer profiles.
- Access order history for each customer.
- Search and filter customers for quick access.

### Reporting
- **Sales Reports**: Analyze sales performance over time.
- **Product Reports**: Understand product popularity and stock levels.
- **Customer Reports**: Gain insights into customer behavior and demographics.

### Authentication
- Secure user registration and login.
- Session management to keep users logged in.
- Protected routes to ensure only authorized access.

## 👤 Creator

**Invenza** was created by **Ahnaf Farhan Hossain**.
- GitHub: [AhnafFarhanHossain](https://github.com/AhnafFarhanHossain)
- LinkedIn: [Your LinkedIn Profile] (Optional)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework.
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
- [Lucide React](https://lucide.dev/) for the icon library.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the creator directly.

---

Made with ❤️ by Ahnaf Farhan Hossain
