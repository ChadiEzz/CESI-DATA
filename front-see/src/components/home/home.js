//External Components
import React from 'react';

//Config
import Routes from "../../config/routes.json";

//Style imports
import './home.css';
import { createTheme, ThemeProvider} from '@mui/material';
//import { Send } from '@mui/icons-material';

const PaletteColor = {
    light: "",
    main: "",
    dark: "",
    contrastText: "",
    mode: "dark"
}

const theme = createTheme({
    palette: {
        mode: PaletteColor.mode
    },

});

function Home() {
    var mail;
    var passwd;

    return (
        <ThemeProvider theme={theme}>
        </ThemeProvider>
    )
} export default Home;