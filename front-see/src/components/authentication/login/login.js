//External Components
import React from 'react';

//Config
import Routes from "../../../config/routes.json";

//Style imports
import './login.css';
import { Grid, TextField, ThemeProvider, Button } from '@mui/material';
import { Send } from '@mui/icons-material';

function Connexion() {
    document.location.href = "http://" + document.location.hostname + ":3000" + Routes.HOME;
}

function Login(props) {
    var mail;
    var passwd;

    return (
        <ThemeProvider theme={props.muiThemeMode}>
            <Grid
                className="loginPage"
                container
                rowGap={5}
                direction="column"
                justifyContent="center"
                alignItems="center">
                <Grid item>
                    <img alt="" src="./LogoPublikeco.png" />
                </Grid>
                <Grid item>
                    <TextField
                        variant="outlined"
                        label="E-Mail"
                        value={mail}/>
                </Grid>
                <Grid item>
                    <TextField
                        variant="outlined"
                        label="Password"
                        type="password"
                        value={passwd} />
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="success"
                        endIcon={<Send />}
                        onClick={Connexion}>
                        Connexion
                    </Button>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
} export default Login;