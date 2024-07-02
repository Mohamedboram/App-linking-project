import  {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../../firebase.tsx';
import {LinkProps, User} from "../../utils/contants.tsx";
import frontendMentor from "../../assets/images/icon-frontend-mentor.svg";
import FontIcon from "../../components/FontIcon";
import {useToast} from "../../components/Toast";
import {getAuth} from "firebase/auth";
import {Spin} from "antd";

const initialUserState: User = {
  firstName: "",
  lastName: "",
  profileImage: "",
  email: "",
};

const PreviewPage = () => {
  const {userId} = useParams(); // Get the user ID from the URL
  const [userData, setUserData] = useState<User>(initialUserState);
  const [links, setLinks] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const {showToast} = useToast();
  const auth = getAuth();
  const user = auth.currentUser;
  const currentUserId = user?.uid;

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserData(data.additionalData || {});
            setLinks(data.links || []);
            setImageSrc(data.profileImage || null);
          } else {
            console.error('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error('User ID is undefined.');
      }

    };

    fetchUserData();
  }, [userId]);


  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(<span><FontIcon name={"link-copied-to-clipboard"} size={"2rem"}/> The link has been copied to your clipboard!</span>);
    } catch (error) {
      console.error("Failed to copy: ", error);
      showToast("Failed to copy the link.");
    }
  };


  if (loading) {
    return <Spin size={"large"}/>;
  }

  return (
    <div className='preview-page'>
      <div className="preview-wrapper">
        {currentUserId === userId && (
          <div className="preview-header">
            <button className='secondary-button' onClick={() => navigate("/")}>Back to Editor</button>
            <button className="primary-button" onClick={handleShareLink}>Share Link</button>
          </div>
        )}
      </div>
      <div className="preview-content">
        <div className='preview-inner'>
          {userData?.firstName !== "" && (
            <div className="user-data">
              <div className="user-avatar">
                {imageSrc && <img src={imageSrc} alt=""/>}
              </div>
              <span className='heading-s user-name'>{userData.firstName} {userData.lastName}</span>
              <span className='body-m user-email'>{userData.email}</span>
            </div>
          )}

          <div className='links'>
            {links.map((link: LinkProps, index) => (
              <div
                key={index}
                style={{backgroundColor: `var(--${link.platform})`}}
                className={`link-illustration-item ${link.platform === 'frontend-mentor' ? 'frontend-mentor-item' : ''}`}
                onClick={() => window.open(link.url, "_blank")}
              >
                {link.platform === 'frontend-mentor' ? (
                  <img src={frontendMentor} alt=''/>
                ) : (
                  <FontIcon size={'1.9rem'} name={link.platform}/>
                )}
                <span className='body-m link-name'>{link.platform}</span>
                <FontIcon className={'arrow-icon'} name={"arrow-right"} size={'1.8rem'}/>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default PreviewPage;
