import React, { Dispatch, SetStateAction } from 'react';
import { Button } from './ui/button';
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/helpers/firebase';
import { getEnv } from '@/helpers/getEnv';
import { showtoast } from '@/helpers/showtoast';
import { RouteIndex } from '@/helpers/RouteName';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/user.slice';
import Loading from './Loading';

interface GoogleLoginProps {
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ loading, setLoading }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const googleRes = await signInWithPopup(auth, provider);
            const user = googleRes.user;
            const bodyData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL
            };

            const res = await fetch(`${getEnv('VITE_API_URL')}/api/auth/google-login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            const data = await res.json();

            if (!res.ok) {
                const errorMessage = data.message || `Server error: ${res.status}`;
                showtoast('error', errorMessage);
                return;
            }

            dispatch(setUser(data.user));
            showtoast('success', data.message || 'Registration successful!');
            navigate(RouteIndex);

        } catch (err: any) {
            console.error('Google Login Error:', err);
            showtoast('error', 'Network error: Unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button className='w-full' onClick={handleLogin} disabled={loading}>
            {loading ? <Loading /> : (
                <>
                    <FcGoogle className="mr-2" />
                    Continue with Google
                </>
            )}
        </Button>
    );
};

export default GoogleLogin;