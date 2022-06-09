//External Components
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Style imports
import './App.css';
import { LightMode, DarkMode } from '@mui/icons-material';
import { createTheme, ThemeProvider, Fab } from '@mui/material';

//My Components
import Login from './components/authentication/login/login';
import Home from './components/home/home';

const lightMode = createTheme({
  palette: {
    mode: "light",
  },
});

const darkMode = createTheme({
  palette: {
    mode: "dark",
  },
})

function themeModeAction(muiThemeMode, setmuiThemeMode) {
  if (muiThemeMode.palette.mode === "light") {
    document.body.style.backgroundColor = "#0a1929";
    setmuiThemeMode(darkMode);
    localStorage.setItem("muiThemeMode", "dark");
  }
  else {
    document.body.style.backgroundColor = "white";
    setmuiThemeMode(lightMode);
    localStorage.setItem("muiThemeMode", "light");
  }
}

function App() {
  const [muiThemeMode, setmuiThemeMode] = useState(darkMode);

  useEffect(() => {
    if (localStorage.getItem('muiThemeMode') === "light")
    {
      document.body.style.backgroundColor = "white";
      setmuiThemeMode(lightMode);
    }
    else {
      localStorage.setItem("muiThemeMode", "dark");
    }
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={muiThemeMode}>
      <BrowserRouter>
        <Routes>
          <Route exact path='/login' element={<Login muiThemeMode={muiThemeMode} />} />
          <Route exact path='/home' element={<Home muiThemeMode={muiThemeMode} />} />
        </Routes>
      </BrowserRouter>
        <Fab className="themeMode" size="large" color="success" onClick={() => themeModeAction(muiThemeMode, setmuiThemeMode)}>
          {
            muiThemeMode.palette.mode === "dark" ?
            <LightMode fontSize="large"/>
            :
            <DarkMode fontSize="large" />
          }
        </Fab>
      </ThemeProvider>
    </div>
  );
} export default App;
