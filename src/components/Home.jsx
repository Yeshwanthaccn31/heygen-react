import { useEffect, useRef, useState } from 'react';
import StreamingAvatar, { AvatarQuality, StreamingEvents } from '@heygen/streaming-avatar';
import '../styles/home.css';
import { mic } from '../assets';
import { upload } from '../assets';

function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Click to start AKIRA');
    const [userInteracted, setUserInteracted] = useState(false);
    const avatarRef = useRef(null);
    const mediaStream = useRef(null);
    const videoRef = useRef(null);
    const recognition = useRef(null);
    const reconnectAttempts = useRef(0);

    const initializeAvatar = async () => {
        setConnectionStatus('Connecting...');
        console.log('Starting avatar initialization...');
        
        try {
            const newAvatar = new StreamingAvatar({
                token: import.meta.env.VITE_HEYGEN_API_TOKEN
            });

            newAvatar.on(StreamingEvents.STREAM_READY, (event) => {
                console.log('Stream ready!');
                if (videoRef.current && event.detail) {
                    videoRef.current.srcObject = event.detail;
                }
                // Set connected state regardless of video element
                setIsConnected(true);
                setConnectionStatus('Connected');
                console.log('Avatar connected successfully, isConnected set to true');
            });

            newAvatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
                console.log('Stream disconnected');
                setIsConnected(false);
                setConnectionStatus('Disconnected');
            });

            // Set avatar immediately after creating it
            avatarRef.current = newAvatar;
            
            console.log('Creating avatar session...');
            const session = await newAvatar.createStartAvatar({
                quality: AvatarQuality.High,
                avatarName: 'Wayne_20240711'
            });
            
            console.log('Avatar session created:', session);
            

            
        } catch (error) {
            console.error('Failed to initialize avatar:', error);
            setConnectionStatus('Connection failed - ' + error.message);
        }
    };

    const handleSpeak = async (text) => {
        console.log('handleSpeak called with:', text, 'avatar exists:', !!avatarRef.current);
        if (avatarRef.current) {
            try {
                await avatarRef.current.speak({ text });
                console.log('Avatar spoke successfully');
            } catch (error) {
                console.error('Failed to speak:', error);
            }
        } else {
            console.log('No avatar available for speaking');
        }
    };

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;
            recognition.current.lang = 'en-US';

            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('Voice input:', transcript);
                handleVoiceResponse(transcript);
            };

            recognition.current.onend = () => {
                setIsListening(false);
            };

            recognition.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                if (event.error === 'network') {
                    console.log('Network error in speech recognition, retrying...');
                    setTimeout(() => {
                        if (recognition.current && isConnected) {
                            recognition.current.start();
                            setIsListening(true);
                        }
                    }, 1000);
                }
            };
        }
    }, []);

    const handleVoiceResponse = async (transcript) => {
        console.log('handleVoiceResponse called, avatar:', !!avatarRef.current);
        
        if (!avatarRef.current) {
            console.log('No avatar object available');
            return;
        }
        
        const response = `I heard you say: ${transcript}. How can I help you with that?`;
        await handleSpeak(response);
    };

    const handleMicClick = async () => {
        if (!userInteracted) {
            setUserInteracted(true);
            await initializeAvatar();
            return;
        }
        
        if (isListening) {
            recognition.current?.stop();
            setIsListening(false);
        } else {
            if (recognition.current) {
                setIsListening(true);
                recognition.current.start();
            } else {
                alert('Speech recognition not supported in this browser');
            }
        }
    };

    return (
        <>
        <div className="container home-container">
            <div className="row main">
                <div className="col-8 left-div">
                    <div className="avatar-div">
                        <div className="avatar">
                            <video 
                                ref={videoRef}
                                autoPlay 
                                playsInline
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '8px'
                                }}
                            />
                            {!isConnected && (
                                <div className="loading-placeholder">
                                    <p>{connectionStatus}</p>
                                    <p style={{fontSize: '12px', color: '#999'}}>Debug: isConnected={isConnected.toString()}, avatar={avatarRef.current ? 'exists' : 'null'}</p>
                                </div>
                            )}
                        </div>
                        <div className="controls">
                            <div className="welcome-message">
                                <p>{isListening ? 'Listening...' : userInteracted ? 'Click the mic and speak to AKIRA' : 'Click the mic to start AKIRA'}</p>
                            </div>
                            <div className="mic-controls">
                                <img 
                                    src={mic} 
                                    alt="mic" 
                                    onClick={handleMicClick}
                                    style={{ 
                                        opacity: userInteracted ? (isConnected ? 1 : 0.5) : 1,
                                        filter: isListening ? 'hue-rotate(120deg)' : 'none',
                                        cursor: 'pointer'
                                    }}
                                />
                                <img src={upload} alt="upload" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-4 right-div d-flex flex-column align-items-center justify-content-center">
                    <div className="cards">
                        <p>Ask AKIRA</p>
                    </div>
                    <div className="d-flex flex-column align-items-center justify-content-center mt-2 mr-3 rounded p-1">
                        <button className="btn btn-light mb-2">What is full form of AKIRA?</button>
                        <button className="btn btn-light mb-2">What is full form of AKIRA?</button>
                        <button className="btn btn-light">What is full form of AKIRA?</button>
                    </div>

                </div>
            </div>
        </div>
        </>
    )
}

export default Home;