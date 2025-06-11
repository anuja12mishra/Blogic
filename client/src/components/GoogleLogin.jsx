import React from 'react'
import { Button } from './ui/button'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/helpers/firebase';
import { getEnv } from '@/helpers/getEnv';
import { showtoast } from '@/helpers/showtoast';
import { RouteIndex } from '@/helpers/RouteName';
import { useNavigate } from 'react-router-dom';

function GoogleLogin() {
    const navigate = useNavigate();
    const handleLogin = async () => {
        const googleRes = await signInWithPopup(auth, provider);
        console.log(googleRes);
        const user  = googleRes.user;
        const bodyData = {
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL
        }
        try {
            const res = await fetch(`${getEnv('VITE_API_URL')}/api/auth/google-login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            // Always await the response parsing
            const data = await res.json();
            // console.log('Server response:', data);

            if (!res.ok) {
                // Server returned an error (like 500)
                const errorMessage = data.message || `Server error: ${res.status}`;
                showtoast('error', errorMessage);
                return;
            }

            // Success case
            const successMessage = data.message || 'Registration successful!';
            showtoast('success', successMessage);
            navigate(RouteIndex);

        } catch (err) {
            // console.error('Request failed:', err);
            showtoast('error', 'Network error: Unable to connect to server');
        }
    }
    return (
        <Button className='w-full' onClick={handleLogin}>
            <FcGoogle />
            Continue with Google
        </Button>
    )
}

export default GoogleLogin;