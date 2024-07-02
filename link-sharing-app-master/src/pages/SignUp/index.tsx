import React, {useEffect, useState} from 'react';
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, User} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import app from "../../firebase";
import FormInput from "../../components/FormInput";
import logo from "../../assets/images/logo-devlinks-large.svg";


const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    password2: '',
  });
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: value ? '' : `Please enter your ${name}` });
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    const { email, password, password2 } = formData;

    if (!email || !password || !password2) {
      setErrors({
        email: !email ? 'Please enter your email' : '',
        password: !password ? 'Please enter your password' : '',
        password2: !password2 ? 'Please repeat your password' : '',
      });
      return;
    }

    if (password !== password2) {
      setErrors({
        ...errors,
        password2: 'Passwords do not match',
      });
      return;
    }

    if (password.length < 8) {
      setErrors({
        ...errors,
        password: 'Passwords must be at least 8 characters',
        password2: 'Passwords must be at least 8 characters',
      });
      return;
    }

    try {
      await createUserWithEmailAndPassword(getAuth(app), email, password);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error:any) {
      alert(error.message)
      console.error('Error signing up:', error.message);
    }
  }

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="auth-page">
      <img className='logo' src={logo} alt="logo"/>
      <div className='form-wrapper'>
        <h2 className='form-title heading-m'>Sign up</h2>
        <p className={'body-m'}>Let’s get you started sharing your links!</p>
        <form onSubmit={handleSignUp} className='form'>
          <FormInput
            placeholder='e.g. alex@email.com'
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email address"
            icon={{name: "email", color: "var(--grey-extra-medium)", size: "1.6rem"}}
            error={errors.email}
          />
          <FormInput
            placeholder='At least 8 characters'
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="Create password"
            icon={{name: "password", color: "var(--grey-extra-medium)", size: "1.6rem"}}
            error={errors.password}
          />
          <FormInput
            placeholder='At least 8 characters'
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            label="Confirm password"
            icon={{name: "password", color: "var(--grey-extra-medium)", size: "1.6rem"}}
            error={errors.password2}
          />
          <p className='body-s' style={{color:"var(--grey-bold)"}}>Password must contain at least 8 characters</p>
          <button className='submit-button primary-button' type="submit">Create an account</button>
          <p className="login-hint body-m">Already have an account? <Link to={'/login'}>Login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
