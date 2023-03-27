import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from 'next/app'
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react'
import { createTheme, ThemeProvider, ThemeOptions, AppBar, Toolbar, IconButton, Typography, Button, CssBaseline, Drawer, ListItem, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { faRobot } from '@fortawesome/sharp-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu } from '@mui/icons-material';
import axios from 'axios';
import { Box } from '@mui/system';
import { useState } from 'react';
import { Link } from '@/components/UnstyledLink';


export default function App(props: AppProps) {
  return <>
    <ThemeProvider theme={createTheme(themeOptions)}>
      <SessionProvider session={props.pageProps.session}>
        <CssBaseline>
          <Content {...props} />
        </CssBaseline>
      </SessionProvider>
    </ThemeProvider>
  </>
}


export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#ef6c00',
    },
    secondary: {
      main: '#ffa000',
    },
    success: {
      main: '#0B6E4F',
    },
    error: {
      main: '#f52a2a',
    },
    info: {
      main: '#006064',
    },
  },
};

const Content = ({ Component, pageProps }: AppProps) => {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  return <>
    {status === 'loading' && <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <FontAwesomeIcon icon={faRobot} size='10x' spin />
      </Box>
    </>}
    {status !== 'loading' && <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href='/' passHref>
              👾 hackrbot 🤖
            </Link>
          </Typography>
          <Button color="error" onClick={() => {
            axios.post('/api/reset');
          }}>RESET</Button>
          {session ? (
            <Button color="inherit" onClick={() => signOut()}>Sign out</Button>
          ) : (
            <Button color='inherit' onClick={() => signIn()}>Sign in</Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor='left'
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <List>
          <ListItem>
            <h2>Servers</h2>
          </ListItem>
          {session && session.user.servers && session.user.servers.map((server) => <>
            <ListItem key={server.id}>
              <Link href={`/server/${server.id}`} passHref>
                <ListItemButton onClick={() => {
                  setSidebarOpen(false);
                }}>
                  <ListItemText primary={server.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          </>)}
        </List>
      </Drawer>
      <Component {...pageProps} />
    </>}
  </>
}