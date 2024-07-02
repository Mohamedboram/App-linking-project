import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import FontIcon from './components/FontIcon';
import illustration from './assets/images/illustration-empty.svg';
import illustrationPhone from './assets/images/illustration-phone-mockup.svg';
import {Select, Spin} from 'antd';
import {LinkProps, listLinks, urlPatterns, User} from './utils/contants.tsx';
import frontendMentor from './assets/images/icon-frontend-mentor.svg';
import Header from './components/Header';
import FormInput from "./components/FormInput";
import {ReactSortable} from "react-sortablejs";
import {db} from "./firebase.tsx";
import {doc, setDoc, getDoc} from 'firebase/firestore';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {useToast} from "./components/Toast";
import iconSaved from "./assets/images/icon-changes-saved.svg"
import avatar from "./assets/images/default-avatar-profile-icon-social-600nw-1677509740.webp"
import './styles/reset.css';
import './styles/App.css';
import "./styles/style-mobile.css"

const isGeneralUrlValid = (url: string) => {
  const regex = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?)$/i;
  return regex.test(url);
};

interface LinkValidationErrors {
  platformValidationMessage?: string;
  urlValidationMessage?: string;
}

const validateUrl = (platform: string, url: string) => {
  const errors: LinkValidationErrors = {};

  if (!platform) {
    errors.platformValidationMessage = 'Platform is required';
  }
  if (!url) {
    errors.urlValidationMessage = 'URL is required';
  } else if (!isGeneralUrlValid(url)) {
    errors.urlValidationMessage = 'Invalid URL link';
  } else {
    const pattern = urlPatterns[platform];
    if (!pattern || !pattern.test(url)) {
      errors.urlValidationMessage = 'Invalid platform link';
    }
  }

  return errors;
};

const initialUserState: User = {
  firstName: "",
  lastName: "",
  profileImage: "",
  email: "",
};

const App: React.FC = () => {
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [userData, setUserData] = useState<User>(initialUserState);
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(null);
  const [loading, setLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const {showToast} = useToast();

  const generateId = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleAddLinks = () => {
    const newLink: LinkProps = {
      id: generateId(),
      platform: '',
      url: '',
      platformValidationMessage: '',
      urlValidationMessage: ''
    };
    setLinks([...links, newLink]);
  };

  const handlePlatformChange = (index: number, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index].platform = value;
    updatedLinks[index].platformValidationMessage = '';
    setLinks(updatedLinks);
  };

  const handleUrlChange = (index: number, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index].url = value;
    updatedLinks[index].urlValidationMessage = '';
    setLinks(updatedLinks);
  };

  const handleRemoveLink = async (index: number) => {
    const newLinks = links.filter((_, linkIndex) => linkIndex !== index);
    setLinks(newLinks);
    await saveLinksToFirestore(newLinks);
  };

  const saveLinksToFirestore = async (updatedLinks: LinkProps[]) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;

      try {
        const userDocRef = doc(db, 'users', userId);

        // Fetch existing user data
        const userDocSnap = await getDoc(userDocRef);
        const existingData = userDocSnap.exists() ? userDocSnap.data() : {};

        const newUserData = {
          ...existingData,
          links: updatedLinks,
        };

        await setDoc(userDocRef, newUserData);

        console.log('Links successfully updated!');
        showToast(<span><img src={iconSaved} alt=""/> Your changes have been successfully saved!</span>);
      } catch (e) {
        console.error('Error updating links: ', e);
      }
    } else {
      console.error('User is not authenticated.');
    }
  };
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        //setProfileImage(e.target?.result);
        const result = e.target?.result;
        if (result !== undefined) {
          setProfileImage(result as string | ArrayBuffer); // Ensure result is not undefined
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleForm = (name: string, value: string) => {
    setUserData(userData => ({...userData, [name]: value}));
    setErrors({...errors, [name]: value ? '' : `Please enter your ${name}`});
  };


  const handleSaveUserData = async () => {
    const auth = getAuth();

    const updatedLinks = links.map(link => ({
      ...link,
      ...validateUrl(link.platform || '', link.url || '')
    }));

    setLinks(updatedLinks);

    const allValid = updatedLinks.every(link => link.platformValidationMessage === '' && link.urlValidationMessage === '');
    if (!allValid) {
      console.log('Some URLs or platforms are invalid. Please correct them before saving.');
      return;
    }

    if (document.querySelector("body")?.classList.contains("show-profile")) {
      if (!userData.firstName || !userData.lastName) {
        setErrors({
          firstName: !userData.firstName ? 'Please enter your first name' : '',
          lastName: !userData.lastName ? 'Please enter your last name' : '',
        });
        return;
      }
    }

    onAuthStateChanged(auth, async (user) => {

      if (user) {

        const userId = user.uid;

        try {
          const userDocRef = doc(db, 'users', userId);

          // Fetch existing user data
          const userDocSnap = await getDoc(userDocRef);
          const existingData = userDocSnap.exists() ? userDocSnap.data() : {};

          // Combine existing data with new data without duplicates
          const existingLinks = existingData.links || [];
          const newLinks = updatedLinks.filter(link =>
            !existingLinks.some((existingLink:LinkProps) => existingLink.url === link.url)
          );

          const newUserData = {
            ...existingData,
            additionalData: userData, // Ensure userData is defined elsewhere in your code
            links: [...existingLinks, ...newLinks], // Merge without duplicates
            profileImage // Add the profileImage
          };

          // Set the user document with the combined data
          await setDoc(userDocRef, newUserData);

          console.log('Data successfully written!');
          showToast(<span><img src={iconSaved} alt=""/> Your changes have been successfully saved!</span>);

        } catch (e) {
          console.error('Error adding data: ', e);
        }
      } else {
        console.error('User is not authenticated.');
      }
    });
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, 'users', userId);

        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserData(data.additionalData || {});
            setLinks(data.links || []);
            setProfileImage(data.profileImage || null);
          } else {
            setUserData(initialUserState);
            setLinks([]);
            setProfileImage(null);
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
          setUserData(initialUserState);
          setLinks([]);
          setProfileImage(null);
        }
        setLoading(false);
      } else {
        setUserData(initialUserState);
        setLinks([]);
        setProfileImage(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);



  if (!isAuthenticated) {
    navigate("/login");
  }

  return (
    <div className='app'>
      <Header isAuthenticated={isAuthenticated}/>
      {loading && <Spin size={"large"} />}
      <div className='main'>
        {!loading && (
          <>
            <div className='preview-area'>
              <div className='preview-area-inner'>
                <img src={illustrationPhone} alt='illustrationPhone image'/>
                {userData.firstName !== "" && (
                  <div className="user-data-preview">
                    <img className='user-avatar' src={profileImage ? profileImage as string :avatar} alt=""/>
                    <span className='heading-s user-name'>{userData.firstName} {userData.lastName}</span>
                    <span className='body-m user-email'>{userData.email}</span>
                  </div>
                )}

                <div className='links-illustration'>
                  {links.map((link, index) => (
                    <div
                      key={index}
                      style={{backgroundColor: `var(--${link.platform})`}}
                      className={`link-illustration-item ${link.platform === 'frontend-mentor' ? 'frontend-mentor-item' : ''}`}
                    >
                      {link.platform === 'frontend-mentor' ? (
                        <img src={frontendMentor} alt=''/>
                      ) : (
                        <FontIcon size={'1.9rem'} name={link.platform}/>
                      )}
                      <span className='text'>{link.platform}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='main-content'>
              <div className='create-links-container'>
                <div className="inner-container">
                  <h2 className='heading-m'>Customize your links</h2>
                  <p className='body-m'>Add/edit/remove links below and then share all your profiles with the world!</p>
                  <button className='secondary-button' onClick={handleAddLinks}>
                    + Add new link
                  </button>
                  {links.length > 0 && (
                    <div className='links-container'>
                      <ReactSortable
                        animation={400}
                        list={links}
                        setList={setLinks}
                        handle={".app-font-icon.icon-drag-and-drop"}
                      >
                        {links.map((link: LinkProps, index: number) => (
                          <div key={`${link.platform}-${index}`} className='link-item'>
                            <div className='link-name'>
                              <FontIcon color={'var(--grey-extra-medium)'} size={'1rem'} name={'drag-and-drop'}/>
                              <span className='label'>Link #{index + 1}</span>
                              <button className='remove-link' onClick={() => handleRemoveLink(index)}>
                                Remove
                              </button>
                            </div>
                            <div className='input-wrapper select-item'>
                              <span className='select-label'>Platform</span>
                              <Select
                                onChange={(value) => handlePlatformChange(index, value)}
                                placeholder={'Choose a platform'}
                                options={listLinks}
                                value={link.platform || undefined}
                              />
                              {link.platformValidationMessage && <span className='error-message'>{link.platformValidationMessage}</span>}
                            </div>
                            <div className='input-wrapper'>
                              <span className='select-label'>Link</span>
                              <div className={`input-link-wrapper ${link.urlValidationMessage || link.platformValidationMessage ? "error-message" : ""}`}>
                                <FontIcon color={'var(--grey-extra-medium)'} name={'links-header'} size={'2rem'}/>
                                <input
                                  type='url'
                                  name={'link'}
                                  placeholder='e.g. https://www.github.com/amjadsh97'
                                  value={link.url}
                                  onChange={(e) => handleUrlChange(index, e.target.value)}
                                  className={link.urlValidationMessage ? 'invalid' : ''}
                                />
                                {link.urlValidationMessage && <span className='error-message'>{link.urlValidationMessage}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </ReactSortable>
                    </div>
                  )}
                  {links.length === 0 && (
                    <div className='empty-state-wrapper'>
                      <div className='empty-state'>
                        <img src={illustration} alt=''/>
                        <h2 className='heading-m'>Let’s get you started</h2>
                        <p className='body-m'>
                          Use the “Add new link” button to get started. Once you have more than one link, you can
                          reorder
                          and
                          edit them. We’re here to
                          help you share your profiles with everyone!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/*<div className='save-button-wrapper'>*/}
                {/*  <button className={'primary-button save-button'} onClick={handleSaveUserData}>*/}
                {/*    Save*/}
                {/*  </button>*/}
                {/*</div>*/}
              </div>

              <div className='profile-details'>
                <div className="inner-container">
                  <h2 className='heading-m'>Profile Details</h2>
                  <p className='body-m'>Add your details to create a personal touch to your profile.</p>
                  <div className='profile-picture'>
                    <div className='upload-image'>
                      <span className='body-m'>Profile picture</span>
                      <div className={`upload-wrapper ${profileImage ? 'image-uploaded' : ''}`}>
                        <div className='upload-container' onClick={handleUploadClick}>
                          <h2 className='heading-s'><FontIcon size={"3.2rem"} color={"inherit"}
                                                              name={"upload-image"}/> {profileImage ? "Change Image" : "+ Upload Image"}
                          </h2>
                          {profileImage && (
                            <div className='image-container'>
                              <img src={profileImage as string} alt='Uploaded Preview'
                                   style={{maxWidth: '500px', maxHeight: '500px'}}/>
                            </div>
                          )}
                        </div>
                        <input
                          id='files'
                          type='file'
                          accept='image/*'
                          onChange={handleImageChange}
                          ref={fileInputRef}
                          style={{display: 'none'}}
                        />
                        <span className='body-s'>Image must be below 1024x1024px. Use PNG or JPG format.</span>
                      </div>
                    </div>
                  </div>
                  <div className="form">
                    <FormInput
                      label="First name"
                      name="firstName"
                      value={userData.firstName}
                      type="text"
                      placeholder="e.g. John"
                      onChange={handleForm}
                      error={errors.firstName}
                      required
                    />
                    <FormInput
                      label="Last name"
                      name="lastName"
                      value={userData.lastName}
                      type="text"
                      placeholder="e.g. Appleseed"
                      onChange={handleForm}
                      required
                      error={errors.lastName}
                    />
                    <FormInput
                      label="Email"
                      name="email"
                      value={userData.email ?? ""}
                      type="email"
                      placeholder="e.g. email@example.com"
                      onChange={handleForm}
                    />
                  </div>
                </div>
                {/*<div className='save-button-wrapper'>*/}
                {/*  <button className={'primary-button save-button'} onClick={handleSaveUserData}>*/}
                {/*    Save*/}
                {/*  </button>*/}
                {/*</div>*/}
              </div>
              <div className='save-button-wrapper'>
                <button disabled={links.length === 0} className={'primary-button save-button'} onClick={handleSaveUserData}>
                  Save
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default App;
