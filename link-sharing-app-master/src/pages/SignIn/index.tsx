import React, {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword, User} from "firebase/auth";
import {Link, useNavigate} from "react-router-dom";
import app from "../../firebase";
import logo from "../../assets/images/logo-devlinks-large.svg"
import FormInput from "../../components/FormInput";


const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const handleChange = (name: string, value: string) => {

    setFormData({...formData, [name]: value});
    setErrors({...errors, [name]: value ? '' : `Please enter your ${name}`});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {email, password} = formData;

    if (!email || !password) {
      setErrors({
        email: !email ? 'Please enter your email' : '',
        password: !password ? 'Please enter your password' : '',
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(getAuth(app), email, password);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error: any) {
      alert("User not found!")
      console.error('Error signing in:', error.message);
    }
  };

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
        <h2 className='form-title heading-m'>Login</h2>
        <p className={'body-m'}>Add your details below to get back into the app</p>
        <form onSubmit={handleSubmit} className='form'>
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
            placeholder='Enter your password'
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
            icon={{name: "password", color: "var(--grey-extra-medium)", size: "1.6rem"}}
            error={errors.password}
          />

          <button className='submit-button primary-button' type="submit">Login</button>
          <p className="login-hint body-m">Don’t have an account? <Link to='/signup'>Create account</Link></p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
