import userModel from "../models/user.model.js";
import { sendEmail } from "../service/mail.service.js";

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

        // 3. Create user (password auto hashed by pre-save)
        const user = await userModel.create({
            username,
            email,
            password,
        });

        // 4. Send email (fail ho bhi gaya toh user create ho chuka hai)
        try {
            await sendEmail({
                to: email,
                subject: `Welcome ${username} to AI-Powered Answer Engine🚀 `,
                html: `
                        <p>Hi ${username},</p>
                        <p>Welcome to <strong>AI-Powered Answer Engine</strong>!</p>
                        <p>Explore smarter answers with AI.</p>
                        <p>— Team</p>
                        <p style="font-size:12px; color:gray;">
                            Developed by <a href="https://www.instagram.com/thecode_director/" target="_blank">@Abhishek Jha</a>
                        </p>
                        `,
                text: `
                        Hi ${username} welcome to plateform,

                        Welcome to AI-Powered Answer Engine!
                        Explore smarter answers with AI.

                        — Team AI-Powered Answer Engine (perplexity)
                        Developed by: https://www.instagram.com/thecode_director/
                                `,
            });
        } catch (emailError) {
            console.error("Email failed:", emailError.message);
        }

        // 5. Final response
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