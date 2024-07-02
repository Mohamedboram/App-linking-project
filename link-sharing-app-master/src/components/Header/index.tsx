import React, {useEffect, useState} from 'react';
import largeLogo from "../../assets/images/logo-devlinks-large.svg";
import FontIcon from "../FontIcon";
import {useNavigate} from "react-router-dom";
import {getAuth, signOut} from "firebase/auth";
import mobileLogo from "../../assets/images/logo-devlinks-small.svg"
import iconLogout from "../../assets/images/log-out.svg";

interface Props {
  isAuthenticated:boolean;
}
const Header: React.FC<Props> = ({isAuthenticated}) => {
  // State to track the active link
  const [activeLink, setActiveLink] = useState<string>('Links'); // Set the initial active link
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;
  const isMobile = innerWidth < 768;

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate("/login")
    }).catch((error) => {
      console.log(error)
    });
  }

  useEffect(() => {
  if (activeLink === "Profile Details") {
    document.querySelector("body")?.classList.add("show-profile")
  } else {
    document.querySelector("body")?.classList.remove("show-profile");
  }
  }, [activeLink])

  return (
    <header className="header">
      <h1 className="logo">
        <picture>
          <source srcSet={mobileLogo} media="(max-width: 767px)" />
          <img src={largeLogo} alt=""/>
        </picture>

      </h1>
      <nav className="navbar">
        <ul className="list">
          <li className="item">
            {/* Add conditional class based on activeLink state */}
            <a
              className={`body-m header-link ${activeLink === 'Links' ? 'active' : ''}`}
              href="#"
              onClick={() => setActiveLink('Links')} // Update active link state onClick
            >
              <FontIcon size={"1.6rem"} name={'links-header'}/> <span>Links</span>
            </a>
          </li>
          <li className="item">
            {/* Add conditional class based on activeLink state */}
            <a
              className={`body-m profile-link ${activeLink === 'Profile Details' ? 'active' : ''}`}
              href="#"
              onClick={() => setActiveLink('Profile Details')} // Update active link state onClick
            >
              <FontIcon size={"1.6rem"} name={'profile-details-header'}/> <span>Profile Details</span>
            </a>
          </li>
        </ul>
      </nav>
      <div className="button-wrapper">
        <button onClick={() => navigate(`/preview/${userId}`)} className="preview-button secondary-button">
          {isMobile ? <FontIcon name={"preview-header"} size={"2rem"}/>:"Preview"}
        </button>

        {isAuthenticated && (<button
          className='primary-button logout-button'
          onClick={() => handleLogout()}
        >{isMobile ? <img src={iconLogout} alt=""/>:"Logout"}</button>)}
      </div>
    </header>
);
};

export default Header;
