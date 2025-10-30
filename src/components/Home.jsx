import '../styles/home.css';
import avatar from '../assets/avatar.png';
import { mic } from '../assets';
import { upload } from '../assets';

function Home() {
    return (
        <>
        <div className="container">
            <div className="row main">
                <div className="col-8 left-div">
                    <div className="avatar-div">
                        <div className="avatar">
                            <img src={avatar} alt="" />
                        </div>
                        <div className="controls">
                            <div className="welcome-message">
                                <p>Just say AKIRA and let me know the report you are looking for</p>
                            </div>
                            <div className="mic-controls">
                                <img src={mic} alt="" />
                                <img src={upload} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-4 right-div">
                    Hi
                </div>
            </div>
        </div>
        </>
    )
}

export default Home;