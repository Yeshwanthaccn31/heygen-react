import '../styles/nav.css'
import { logo } from '../assets';
import { menu } from '../assets';

function Nav() {
    return (
        <>
            <nav className='nav'>
                <div className="nav-left">
                    <img src={menu} alt="hamburger" />
                    <img src={logo} alt="logo" />
                    <p className='nav-akira'>AKIRA</p>
                </div>
                <div className="nav-right">
                    <p className='welcome-nav'>Welcome back, Yeshwanth</p>
                    <div className="pp">
                        <img className='pp-img' src="https://ui-avatars.com/api/?name=Yeshwanth&size=40&background=cccccc&color=666666" alt="Profile" />
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Nav;