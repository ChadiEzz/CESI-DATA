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
import { AddCircle, AddCircleOutline, AspectRatio, BarChart, Campaign, Delete } from '@mui/icons-material'
import { Card, CardHeader, CardMedia, Grid } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import logoSmall from '../../logoGreen.png';
import logoBig from '../../LogoPublikeco.png';
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
  const [dataViz, setDataViz] = React.useState([]);
  const [lastMonthsAdData, setLastMonthsAdData] = React.useState([]);
  const [lastMonthsSpaceData, setLastMonthsSpaceData] = React.useState([]);
  const [menu1, setMenu1] = React.useState(true);
  const [menu2, setMenu2] = React.useState(false);
  const [menu3, setMenu3] = React.useState(false);
  const [menu4, setMenu4] = React.useState(false);
  const [menu5, setMenu5] = React.useState(false);

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
      setDataViz(data);
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
  }

  const onMenuClick2 = () => {
    setMenu1(false);
    setMenu2(true);
    setMenu3(false);
    setMenu4(false);
    setMenu5(false);
  }
  const onMenuClick3 = () => {
    setMenu1(false);
    setMenu2(false);
    setMenu3(true);
    setMenu4(false);
    setMenu5(false);
  }
  const onMenuClick4 = () => {
    setMenu1(false);
    setMenu2(false);
    setMenu3(false);
    setMenu4(true);
    setMenu5(false);
  }
  const onMenuClick5 = () => {
    setMenu1(false);
    setMenu2(false);
    setMenu3(false);
    setMenu4(false);
    setMenu5(true);
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
        </Drawer>
        <Grid container gap={3} sx={{ paddingLeft: "15px", paddingRight: "15px", paddingTop: "70px", paddingBottom: "6px" }}>
          {
            menu1 ?
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
                    <CardMedia
                      component="img"
                      height="194"
                      image={ad._source.adFile.adFile}
                      alt={ad._source.adFile.adTitle}
                    />
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
                        subheader={""}
                        action={
                          <IconButton id={space._id} aria-label="delete" onClick={() => removeSpace(space._id)}>
                            <Delete />
                          </IconButton>
                        }
                      />
                      <CardMedia
                        component="img"
                        height="194"
                        image={logoSmall}
                        alt={space._id}
                      />
                    </Card>
                  );
                })
                :
                menu3 === true ?
                  <Bar options={verticalOption} data={verticalData} />
                  :
                  ""
          }
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
