export const getVerificationEmailTemplate = (
  name: string,
  verificationLink: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Invenza Account</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Boldonse&display=swap');
        body {
            font-family: Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 20px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 0.625rem;
            overflow: hidden;
        }
        .header {
            background-color: #121212;
            padding: 40px;
            text-align: center;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        .content h1 {
            font-family: 'Boldonse', sans-serif;
            font-size: 28px;
            color: #111827;
            margin-bottom: 20px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #4b5563;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            background-color: #ff6b00;
            text-decoration: none;
            border-radius: 0.5rem;
            transition: background-color 0.2s;
        }
        .button:hover {
            background-color: #ff8c42;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://i.imgur.com/3Y0a0v3.png" alt="Invenza Logo">
        </div>
        <div class="content">
            <h1>Almost there, ${name}!</h1>
            <p>Welcome to Invenza! To get started, please verify your email address by clicking the button below. This link will expire in one hour.</p>
            <a href="${verificationLink}" class="button">Verify My Account</a>
        </div>
        <div class="footer">
            <p>&copy; 2024 Invenza. All rights reserved.</p>
            <p>If you did not sign up for this account, you can safely ignore this email.</p>
        </div>
    </div>
</body>
</html>
`;