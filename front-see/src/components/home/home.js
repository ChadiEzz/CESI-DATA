import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { AddCircle, AddCircleOutline, AspectRatio, BarChart, Campaign, Check, Close, Delete, ImageSearch, Send } from '@mui/icons-material'
import { Button, Card, CardHeader, CardMedia, Grid, TextField, Paper, CardActionArea, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Snackbar, Alert } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import logoSmall from '../../logoGreen.png';
import logoBig from '../../LogoPublikeco.png';
import Draggable from 'react-draggable';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './home.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const drawerWidth = 240;

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Home(props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [adList, setAdList] = React.useState([]);
  const [spaceList, setSpaceList] = React.useState([]);
  const [lastMonthsAdData, setLastMonthsAdData] = React.useState([]);
  const [lastMonthsSpaceData, setLastMonthsSpaceData] = React.useState([]);
  const [menu1, setMenu1] = React.useState(true);
  const [menu2, setMenu2] = React.useState(false);
  const [menu3, setMenu3] = React.useState(false);
  const [menu4, setMenu4] = React.useState(false);
  const [menu5, setMenu5] = React.useState(false);
  const [menu6, setMenu6] = React.useState(false);
  const [appID, setAppID] = React.useState("");
  const [getAdImage, setGetAdImage] = React.useState("./LogoPublikeco.png");
  const [openDialogAd, setOpenDialogAd] = React.useState(false);
  const [dialogInfos, setDialogInfos] = React.useState({
    titre: "",
    ageFrom: "",
    ageTo: "",
    sex: "",
    bid: "",
    mature: false,
    gamble: false,
    politic: false,
    religion: false
  });
  const [alertInfos, setAlertInfos] = React.useState({
    msg: "",
    severity: "",
    open: false,
    duration: 6000
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getDataViz = async () => {
    var myHeaders = new Headers();

    var myInit = {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    };

    await fetch("http://" + document.location.hostname + ":8080/data-requests", myInit).then(res => {
      return res.json();
    }).then(data => {
      var adTab = [62, 83, 12, 46, 26, 99];
      var spaceTab = [26, 38, 47, 50, 80, 83];
      adTab[5] += data.createAd.length;
      spaceTab[5] += data.createSpace.length;
      setLastMonthsAdData(adTab);
      setLastMonthsSpaceData(spaceTab);
    });
  }

  const getAdList = async () => {
    var myHeaders = new Headers();

    var myInit = {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    };

    await fetch("http://" + document.location.hostname + ":8080/list-by-index?index=advertisements", myInit).then(res => {
      return res.json();
    }).then(data => {
      var tmp = [...data.hits.hits];
      setAdList(tmp);
    });
  }

  const getSpaceList = async () => {
    var myHeaders = new Headers();

    var myInit = {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    };

    await fetch("http://" + document.location.hostname + ":8080/list-by-index?index=adspaces", myInit).then(res => {
      return res.json();
    }).then(data => {
      var tmp = [...data.hits.hits];
      setSpaceList(tmp);
    });
  }

  const handleCloseAlert = () => {
    setAlertInfos({
      msg: "",
      severity: "",
      open: false,
      duration: 6000
    })
  }

  const removeAd = async (documentID) => {
    var myBody = {
      index: "advertisements",
      id: documentID
    }

    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(myBody)
    };

    await fetch("http://" + document.location.hostname + ":8080/remove-document", requestOptions).then(res => {
      return res.json();
    }).then(data => {
      getAdList();
    });
  }

  const removeSpace = async (documentID) => {
    var myBody = {
      index: "adspaces",
      id: documentID
    }

    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(myBody)
    };

    await fetch("http://" + document.location.hostname + ":8080/remove-document", requestOptions).then(res => {
      return res.json();
    }).then(data => {
      getSpaceList();
    });
  }

  const onMenuClick1 = () => {
    setMenu1(true);
    setMenu2(false);
    setMenu3(false);
    setMenu4(false);
    setMenu5(false);
    setMenu6(false);
  }

  const onMenuClick2 = () => {
    setMenu1(false);
    setMenu2(true);
    setMenu3(false);
    setMenu4(false);
    setMenu5(false);
    setMenu6(false);
  }
  const onMenuClick3 = () => {
    setMenu1(false);
    setMenu2(false);
    setMenu3(true);
    setMenu4(false);
    setMenu5(false);
    setMenu6(false);
  }
  const onMenuClick4 = () => {
    setMenu1(false);
    setMenu2(false);
    setMenu3(false);
    setMenu4(true);
    setMenu5(false);
    setMenu6(false);
  }
  const onMenuClick5 = () => {
    setMenu1(false);
    setMenu2(false);
    setMenu3(false);
    setMenu4(false);
    setMenu5(true);
    setMenu6(false);
  }

  const onMenuClick6 = () => {
    setMenu1(false);
    setMenu2(false);
    setMenu3(false);
    setMenu4(false);
    setMenu5(false);
    setMenu6(true);
  }

  React.useEffect(() => {
    getAdList();
    getSpaceList();
    getDataViz();
  }, []);

  const dataMonths = ['Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'];

  const verticalOption = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Nombre d\'Ajout',
      },
    },
  };

  const verticalData = {
    labels: dataMonths,
    datasets: [
      {
        label: 'Publicités',
        data: lastMonthsAdData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Espaces',
        data: lastMonthsSpaceData,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const askForAd = async () => {
    var myHeaders = new Headers();

    var myInit = {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    };

    await fetch("http://" + document.location.hostname + ":8081/get-my-ad?spaceid=" + appID, myInit).then(res => {
      return res.json();
    }).then(data => {
      if (data.hits.hits.length === 0) {
        setAlertInfos({
          msg: "Aucune publicité ne correspond à vos critères",
          severity: "info",
          open: true,
          duration: 6000
        })
        console.log(data);
      } else {
        setAlertInfos({
          msg: "Nous avons trouvé la publicité la plus adaptée à vos critères !",
          severity: "success",
          open: true,
          duration: 6000
        })
        setGetAdImage(data.hits.hits[0]._source.adFile.adFile);
      }
    });
  }

  function appIdChange(e) {
    setAppID(e.target.value);
  }

  const handleCloseDialogAd = () => {
    setOpenDialogAd(false);
  };

  return (
    <ThemeProvider theme={props.muiThemeMode}>
      <Box sx={{ display: 'flex', overflowX: 'hidden' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"

              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <AspectRatio />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              AD-BOARD
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          {
            open ?
              <img id="logoPubBid" alt="" src={logoBig} style={{ width: "100%", marginRight: "20%" }} />
              :
              <img id="logoPubSmall" alt="" src={logoSmall} style={{}} />
          }
          <Divider />
          <List>
            <ListItem key={"Annonces"} disablePadding sx={{ display: 'block' }} onClick={() => onMenuClick1()}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                id="MenuButton1"
                selected={menu1}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Campaign />
                </ListItemIcon>
                <ListItemText primary={"Annonces"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"Espaces Publicitaires"} disablePadding sx={{ display: 'block' }} onClick={() => onMenuClick2()}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                id="MenuButton2"
                selected={menu2}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Espaces Publicitaires"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"Data Visualization"} disablePadding sx={{ display: 'block' }} onClick={() => onMenuClick3()}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                id="MenuButton3"
                selected={menu3}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <BarChart />
                </ListItemIcon>
                <ListItemText primary={"Data Visualization"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem key={"Créer une Annonce"} disablePadding sx={{ display: 'block' }} onClick={() => onMenuClick4()}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                id="MenuButton4"
                selected={menu4}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <AddCircle />
                </ListItemIcon>
                <ListItemText primary={"Créer une Annonce"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"Déclarer un Espace"} disablePadding sx={{ display: 'block' }} onClick={() => onMenuClick5()}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                id="MenuButton5"
                selected={menu5}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <AddCircleOutline />
                </ListItemIcon>
                <ListItemText primary={"Déclarer un Espace"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem key={"Demander une Pub"} disablePadding sx={{ display: 'block' }} onClick={() => onMenuClick6()}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                id="MenuButton6"
                selected={menu6}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <ImageSearch />
                </ListItemIcon>
                <ListItemText primary={"Demander une Pub"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Grid container gap={3} sx={{ paddingLeft: "15px", paddingRight: "15px", paddingTop: "70px", paddingBottom: "6px" }}>
          {
            menu1 === true ?
              adList.map(ad => {
                var dateArray = ad._source.targets.period.from.split('-');
                var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var date = new Date(dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2]);
                return (
                  <Card id={ad._id} key={ad._id} sx={{ width: '310px', display: "inline-block" }}>
                    <CardHeader
                      title={ad._source.adFile.adTitle}
                      subheader={date.toLocaleDateString("fr-FR", dateOptions)}
                      action={
                        <IconButton id={ad._id} aria-label="delete" onClick={() => removeAd(ad._id)}>
                          <Delete />
                        </IconButton>
                      }
                    />
                    <CardActionArea onClick={() => {
                      setOpenDialogAd(true);
                      setDialogInfos({
                        titre: ad._source.adFile.adTitle,
                        ageFrom: ad._source.targets.userProfile.age.from,
                        ageTo: ad._source.targets.userProfile.age.to,
                        sex: ad._source.targets.userProfile.sex === "MALE" ? "Hommes" : ad._source.targets.userProfile.sex === "FEMALE" ? "Femmes" : "Les deux",
                        bid: ad._source.targets.bid.max,
                        mature: ad._source.targets.restrictedContent.mature,
                        gamble: ad._source.targets.restrictedContent.gamble,
                        politic: ad._source.targets.restrictedContent.politic,
                        religion: ad._source.targets.restrictedContent.religion
                      })
                    }}>
                      <CardMedia
                        component="img"
                        height="194"
                        image={ad._source.adFile.adFile}
                        alt={ad._source.adFile.adTitle}
                      />
                    </CardActionArea>
                  </Card>
                );
              })
              :
              menu2 === true ?
                spaceList.map(space => {
                  return (
                    <Card id={space._id} key={space._id} sx={{ width: '310px', display: "inline-block" }}>
                      <CardHeader
                        title={space._source.name}
                        subheader={"ID : " + space._id}
                        action={
                          <IconButton id={space._id} aria-label="delete" onClick={() => removeSpace(space._id)}>
                            <Delete />
                          </IconButton>
                        }
                      />
                      <CardActionArea onClick={() => {
                        setOpenDialogAd(true);
                        setDialogInfos({
                          titre: space._source.name,
                          ageFrom: space._source.userProfile.age.from,
                          ageTo: space._source.userProfile.age.to,
                          sex: space._source.userProfile.sex === "MALE" ? "Hommes" : space._source.userProfile.sex === "FEMALE" ? "Femmes" : "Les deux",
                          bid: space._source.validConditions.minBid,
                          mature: space._source.restrictedContent.mature,
                          gamble: space._source.restrictedContent.gamble,
                          politic: space._source.restrictedContent.politic,
                          religion: space._source.restrictedContent.religion
                        })
                      }}>
                        <CardMedia
                          component="img"
                          height="194"
                          image={logoSmall}
                          alt={space._id}
                        />
                      </CardActionArea>
                    </Card>
                  );
                })
                :
                menu3 === true ?
                  <Bar options={verticalOption} data={verticalData} />
                  :
                  menu6 === true ?
                    <Grid
                      container
                      rowGap={5}
                      direction="column"
                      justifyContent="center"
                      alignItems="center">
                      <Grid item>
                        <img alt="" src={getAdImage} style={{ width: '310px' }} />
                      </Grid>
                      <Grid item>
                        <TextField
                          variant="outlined"
                          label="ID D'application"
                          value={appID}
                          onChange={appIdChange} />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="success"
                          endIcon={<Send />}
                          onClick={() => askForAd()}>
                          Demander
                        </Button>
                      </Grid>
                    </Grid>
                    :
                    ""
          }
          <Dialog
            open={openDialogAd}
            onClose={handleCloseDialogAd}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              {
                dialogInfos.titre
              }
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {
                  "Tranche d'âge cible : De " + dialogInfos.ageFrom + " à " + dialogInfos.ageTo
                }
                <br />
                <br />
                {
                  "Genre cible : " + dialogInfos.sex
                }
                <br />
                <br />
                {
                  "Enchère : " + dialogInfos.bid + " €"
                }
                <br />
                <br />
                {
                  "Contenu :"
                }
                <br />
                {
                  "• Adulte : "
                }
                {
                  dialogInfos.mature ? <Check sx={{ paddingTop: "5px", color: "green" }} /> : <Close sx={{ paddingTop: "5px", color: "red" }} />
                }
                <br />
                {
                  "• Jeux d'argent : "
                }
                {
                  dialogInfos.gamble ? <Check sx={{ paddingTop: "5px", color: "green" }} /> : <Close sx={{ paddingTop: "5px", color: "red" }} />
                }
                <br />
                {
                  "• Politique : "
                }
                {
                  dialogInfos.politic ? <Check sx={{ paddingTop: "5px", color: "green" }} /> : <Close sx={{ paddingTop: "5px", color: "red" }} />
                }
                <br />
                {
                  "• Religion : "
                }
                {
                  dialogInfos.religion ? <Check sx={{ paddingTop: "5px", color: "green" }} /> : <Close sx={{ paddingTop: "5px", color: "red" }} />
                }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseDialogAd} color="success">
                Fermer
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar anchorOrigin={{ vertical:'bottom', horizontal: 'center' }} open={alertInfos.open} autoHideDuration={alertInfos.duration} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={alertInfos.severity} sx={{ width: '100%' }}>
              {
                alertInfos.msg
              }
            </Alert>
          </Snackbar>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
