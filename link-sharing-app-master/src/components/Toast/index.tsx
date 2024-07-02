import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import "./style.css"
interface ToastContextType {
  showToast: (message: ReactNode) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<ReactNode | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(false); // To handle the animation delay

  const showToast = useCallback((message: ReactNode) => {
    setToastMessage(message);
    setAnimate(false);
    setVisible(true);
    setTimeout(() => {
      setAnimate(true);
    }, 10); // Small delay to trigger animation
    setTimeout(() => {
      setVisible(false);
      setAnimate(false);
    }, 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toastMessage} visible={visible} animate={animate} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const Toast: React.FC<{ message: ReactNode | null, visible: boolean, animate: boolean }> = ({ message, visible, animate }) => {
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) setShouldRender(true);
  }, [visible]);

  const onAnimationEnd = () => {
    if (!visible) setShouldRender(false);
  };

  return shouldRender ? (
    <div className={`toast-wrapper ${visible ? (animate ? 'show' : '') : 'hide'}`} onAnimationEnd={onAnimationEnd}>
      {message}
    </div>
  ) : null;
};
