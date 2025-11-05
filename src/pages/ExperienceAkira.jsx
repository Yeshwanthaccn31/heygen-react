import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import StreamingAvatar, { AvatarQuality, StreamingEvents } from '@heygen/streaming-avatar';
import { avatar } from '../assets';

function ExperienceAkira() {
    const navigate = useNavigate();
    const [userInteracted, setUserInteracted] = useState(false);
    const avatarRef = useRef(null);

    const initializeAvatar = async () => {
        try {
            const newAvatar = new StreamingAvatar({
                token: import.meta.env.VITE_HEYGEN_API_TOKEN
            });

            avatarRef.current = newAvatar;
            
            await newAvatar.createStartAvatar({
                quality: AvatarQuality.High,
                avatarName: 'Anna_public_3_20240108'
            });
            
        } catch (error) {
            console.error('Failed to initialize avatar:', error);
        }
    };

    const handleExperienceClick = () => {
        navigate('/home', { state: { shouldInitialize: true } });
    };

    return (
        <div className="container" style={{ height: '80vh', display: 'flex', alignItems: 'center' }}>
            <div className="row w-100">
                <div className="col-6 d-flex align-items-center justify-content-center">
                    <img 
                        src={avatar} 
                        alt="AKIRA Avatar" 
                        style={{ 
                            maxWidth: '100%', 
                            height: 'auto',
                            borderRadius: '8px'
                        }}         
                    />
                </div>
                <div className="col-6 d-flex flex-column align-items-center justify-content-center">
                    <h1 className="mb-4">Meet AKIRA</h1>
                    <p className="mb-4 text-center">Your AI-Powered guide to insights & reports. <br />Speak and watch knowledge come alive!</p>
                    <button 
                        className="btn btn-primary"
                        onClick={handleExperienceClick}
                    >
                        Experience AKIRA
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ExperienceAkira;