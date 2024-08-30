import { useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import WeatherData from './components/WeatherData';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div
      className={`h-screen px-4 ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}
    >
      <div className='h-[10vh] flex justify-end items-center p-4'>
        {theme === 'light' ? (
          <MdDarkMode
            className='h-[25px] w-[25px] cursor-pointer'
            onClick={toggleTheme}
          />
        ) : (
          <MdLightMode
            className='h-[25px] w-[25px] cursor-pointer'
            onClick={toggleTheme}
          />
        )}
      </div>
      <div className="">
        <WeatherData theme={theme} />
      </div>
    </div>
  );
}

export default App;
