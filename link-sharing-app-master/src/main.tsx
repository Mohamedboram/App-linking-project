import React from 'react'
import App from './App.tsx'
import {Routes, Route, BrowserRouter} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Preview from "./pages/Preview";
import {ToastProvider} from "./components/Toast";
import ReactDOM from 'react-dom/client';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/preview/:userId" element={<Preview />} />
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>

  </React.StrictMode>
);


