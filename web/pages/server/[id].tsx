import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { Box, Button, CircularProgress } from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Image from "next/image"
import { io, Socket } from "socket.io-client"
import axios from "axios"
import { Track } from "discord-player"
import { useCookie } from "next-cookie"
import { GetServerSidePropsContext } from "next"

let socket: Socket;

export default function Server({ token }: { token: string }) {
  const { data: session, status } = useSession()
  const { query, route } = useRouter()
  const [currentTrack, setCurrentTrack] = useState<Track>()

  const socketInitializer = async () => {
    if (socket) {
      socket.disconnect().connect();
    };
    await axios.get("/api/socket")
    socket = io({
      auth: {
        token
      }
    })

    socket.on("connect", () => {
      console.log("connected")
      socket.emit("client-connect", { guildId: query.id })
    });
  }

  const server = session?.user?.servers?.find(server => server.id === query.id)

  useEffect(() => {
    socketInitializer()
  }, [route])

  return <>
    {status === 'authenticated' && server && <>
      <Box sx={{ display: "flex", marginTop: "64px", flexDirection: "column" }}>
        <HeaderHolder sx={{ flexGrow: 1, padding: "0 20px", flexDirection: "row", display: "flex" }}>
          {server.icon && <object data={server.icon.includes(".") ? server.icon : `https://cdn.discordapp.com/icons/${server?.id}/${server?.icon}.gif`} type="image/png">
            <Image width={42} height={42} src={server.icon.includes(".") ? server.icon : `https://cdn.discordapp.com/icons/${server?.id}/${server?.icon}.webp`} alt="server_icon" />
          </object>}
          <h1>{server.name}</h1>
        </HeaderHolder>
        <PlayerHolder>
          <h3>Now Playing: {currentTrack?.description}</h3>
          <Button variant="contained" color="primary" onClick={() => {
            socket.emit("bot-command", {
              command: "join",
              guildId: server.id
            });
          }}>Join</Button>
          <Button variant="contained" color="primary" onClick={() => {
            socket.emit("bot-command", {
              command: "leave",
              guildId: server.id
            });
          }}>Leave</Button>
        </PlayerHolder>
      </Box>
    </>}
    {status === 'loading' && <>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    </>}
  </>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookie = useCookie(context);
  return {
    props: {
      token: cookie.get("__Secure-next-auth.session-token") ?? ""
    }
  };
}

const HeaderHolder = styled(Box)`
  display: flex;
  flex-direction: row;
  padding: 0 20px;
  flex-grow: 1;
  align-items: center;
  img, object {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    margin-right: 10px;
  }
`

const PlayerHolder = styled(Box)`
  height: auto;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding: 0 20px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
`