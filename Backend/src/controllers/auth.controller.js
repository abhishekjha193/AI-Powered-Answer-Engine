import userModel from "../models/user.model.js";
import { sendEmail } from "../service/mail.service.js";
import jwt from "jsonwebtoken";

//register
export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        // 1. Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // 2. Check if user already exists
        const existingUser = await userModel.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username or email already exists",
            });
        }

        // 3. Create user
        const user = await userModel.create({
            username,
            email,
            password,
        });

        // 4. Create verification token
        const emailVerificationToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 5. Send email
        try {
            await sendEmail({
                to: email,
                subject: "Welcome 🚀",
                html: `
                    <p>Hi ${username},</p>
                    <p>Welcome to <strong>AI-Powered Answer Engine</strong>!</p>
                    <p>Click below to verify your email:</p>
                    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}" 
                       style="padding:10px 20px; background:#007BFF; color:white; text-decoration:none;">
                       Verify Email
                    </a>
                `
            });

            console.log("✅ Email sent");
        } catch (emailError) {
            console.error("❌ Email failed:", emailError.message);
        }

        // 6. Response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

//verify email
export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        user.verified = true;
        await user.save();

        return res.send(`
                            <!DOCTYPE html>
                            <html lang="en">
                            <head>
                            <meta charset="UTF-8">
                            <title>Email Verified</title>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">

                            <style>
                                body {
                                    margin: 0;
                                    padding: 0;
                                    font-family: 'Segoe UI', sans-serif;
                                    background: linear-gradient(135deg, #4facfe, #00f2fe);
                                    height: 100vh;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    overflow: hidden;
                                }

                                .card {
                                    background: rgba(255, 255, 255, 0.95);
                                    padding: 40px;
                                    border-radius: 20px;
                                    text-align: center;
                                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                                    animation: fadeIn 1s ease forwards;
                                    transform: translateY(20px);
                                }

                                h1 {
                                    color: #2ecc71;
                                    margin-bottom: 10px;
                                    font-size: 28px;
                                    animation: pop 0.6s ease forwards;
                                }

                                p {
                                    color: #555;
                                    font-size: 16px;
                                    margin-bottom: 25px;
                                    opacity: 0;
                                    animation: fadeIn 1.2s ease forwards 0.5s;
                                }

                                a {
                                    display: inline-block;
                                    padding: 12px 25px;
                                    background: linear-gradient(45deg, #007BFF, #00c6ff);
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 30px;
                                    font-weight: bold;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
                                    opacity: 0;
                                    animation: fadeIn 1.2s ease forwards 0.8s;
                                }

                                a:hover {
                                    transform: translateY(-3px) scale(1.05);
                                    box-shadow: 0 15px 30px rgba(0,0,0,0.25);
                                }

                                .checkmark {
                                    font-size: 60px;
                                    color: #2ecc71;
                                    margin-bottom: 15px;
                                    animation: bounce 1s ease;
                                }

                                @keyframes fadeIn {
                                    to {
                                        opacity: 1;
                                        transform: translateY(0);
                                    }
                                }

                                @keyframes pop {
                                    0% { transform: scale(0.7); opacity: 0; }
                                    100% { transform: scale(1); opacity: 1; }
                                }

                                @keyframes bounce {
                                    0%, 100% { transform: translateY(0); }
                                    50% { transform: translateY(-10px); }
                                }
                            </style>
                            </head>

                            <body>

                            <div class="card">
                                <div class="checkmark">✅</div>
                                <h1>Email Verified Successfully</h1>
                                <p>Your account is now fully activated. You can securely log in and start using all features.</p>

                                <a href="http://localhost:3000/login">
                                    Go to Login →
                                </a>
                            </div>

                            </body>
                            </html>
                        `);

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}

//login
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie("token", token)

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

// get-me
export async function getMe(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}

