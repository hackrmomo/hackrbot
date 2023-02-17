import { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { signIn, signOut, useSession } from "next-auth/react";
import { Container } from '@mui/system';
import { Autocomplete, Box, Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, Typography } from '@mui/material';

import { commands } from "@/lib/config"
import { FaIcon } from '@/components/FaIcon';
import { faArrowRight } from '@fortawesome/sharp-solid-svg-icons';
import axios from 'axios';

export default function Home() {
  const { data: session, status } = useSession()
  const [server, setServer] = useState<string>("")
  const [command, setCommand] = useState<string>("")
  const [params, setParams] = useState<{[key: string]: any }>({})

  return (
    <>
      <Head>
        <title>hackrbot</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container>
          {
            session
              ? <>
                <Grid container spacing={4} sx={{ marginTop: "1em" }}>
                  <Grid item xs={12}>
                    <Typography variant='h3'>{`Welcome, ${session.user.name}!`}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="server-label">Server</InputLabel>
                      <Select
                        labelId="server-label"
                        value={server}
                        onChange={(e) => setServer(e.target.value as string)}
                        input={<OutlinedInput label="Server" />}
                      >
                        {(session.user.servers ?? []).map((server) => (
                          <MenuItem key={server.id} value={server.id}>{server.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid sx={{ display: "flex", flexDirection: "row", gap: 2, " > *": { flex: 1 }, "> *:last-child": { flex: 0 }, alignItems: "center" }} item xs={12}>
                    <Box key={"selector"}>
                      <Autocomplete
                        disablePortal
                        options={commands}
                        renderInput={(params) => <TextField {...params} label="Command" variant="outlined" />}
                        getOptionLabel={(option) => `/${option.name}`}
                        renderOption={(props, option) => <Box
                          component="li"
                          sx={{ gap: 2 }}
                          {...props}
                        >
                          <Typography variant="h6">{`/${option.name}`}</Typography>
                          <Typography color="gray" variant="body2">{option.description}</Typography>
                        </Box>}
                        onInputChange={(e, value) => {
                          setCommand(value.substring(1))
                        }}
                      />
                    </Box>
                    {commands.find((c) => c.name === command)?.options?.map((param) => (
                      <Box key={param.name}>
                        <TextField
                          fullWidth
                          onChange={(e) => {
                            setParams({
                              ...params,
                              [param.name]: e.target.value
                            })
                          }}
                          value={params[param.name]}
                          label={param.name}
                          variant="outlined"
                        />
                      </Box>
                    ))}
                    <Box>
                      <Button disabled={!command || !server} sx={{height: 56}} fullWidth variant="outlined" color='secondary' onClick={async () => {
                        await axios.post("/api/bot", {
                          command,
                          userId: session.user.discordId,
                          guildId: server,
                          params: params
                        })
                      }}>
                        <FaIcon icon={faArrowRight} />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </>
              : <>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                  <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }} elevation={24}>
                    <Typography variant='h3'>Welcome to hackrbot!</Typography>
                    <Typography variant='h5'>Please sign in to continue.</Typography>
                  </Paper>
                </Box>
              </>
          }
        </Container>
      </main>
    </>
  )
}
