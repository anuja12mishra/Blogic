import User from '../models/user.model.js';
import { handleError } from '../helpers/handleError.js';
import bcryptjs from 'bcryptjs';

export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Required fields validation
    if (!name || !email || !password) {
      return next(handleError(403, 'All fields are required'));
    }

    // 2. Gmail validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return next(handleError(403, 'Only Gmail addresses are allowed'));
    }

    // 3. Password strength checks
    if (password.length < 6) {
      return next(handleError(403, 'Password must be at least 6 characters long'));
    }

    const hasDigit = /[0-9]/.test(password);
    const hasAlphabet = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

    if (!hasDigit || !hasAlphabet || !hasSpecialChar) {
      return next(handleError(403, 'Password is too weak'));
    }

    // 4. Check if user already exists
    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
      return next(handleError(403, 'User already exists'));
    }

    // 5. Hash the password
    const salt = parseInt(process.env.SALT) || 10;
    const hashPass = bcryptjs.hashSync(password, salt);

    // 6. Save the new user
    const newUser = new User({
      name,
      email,
      password: hashPass,
    });

    await newUser.save();

    // 7. Send success response
    res.status(201).json({
      success: true,
      message: 'Registration successful',
    });

  } catch (err) {
    console.error(err.message);
    next(handleError(500, err.message));
  }
};

export const Login = async(req,res)=>{
    
}
