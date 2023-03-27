import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { Box, Button, CircularProgress, Divider, ListItem } from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Image from "next/image"
import { io, Socket } from "socket.io-client"
import axios from "axios"
import { Track } from "discord-player"
import { getCookie } from "cookies-next"
import { GetServerSidePropsContext } from "next"
import { GuildStatus } from "@/models/GuildStatus"
import { FaIcon } from "@/components/FaIcon"
import { faForward, faPlayPause, faBackward } from "@fortawesome/pro-duotone-svg-icons"
import { MediaButton } from "@/components/MediaButton"
import Head from "next/head"

let socket: Socket;

export default function Server({ token }: { token: string }) {
  const { data: session, status } = useSession()
  const { query, route } = useRouter()
  const [guildStatus, setGuildStatus] = useState<GuildStatus>({
    id: query.id as string,
    playing: false,
    nowPlaying: null,
    queue: [],
    timestamp: {
      current: {
        label: "00:00",
        value: 0
      },
      total: {
        label: "00:00",
        value: 0
      },
      progress: 0
    }
  })

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

    socket.on("bot-status", (data: GuildStatus) => {
      setGuildStatus(data)
    })
  }

  const server = session?.user?.servers?.find(server => server.id === query.id)

  useEffect(() => {
    socketInitializer()
  }, [route])

  return <>
    <Head>
      <title>{server?.name} | hackrbot</title>
    </Head>
    {status === 'authenticated' && server && <>
      <BackdropContainer>
        {guildStatus.nowPlaying?.thumbnail && <Image fill style={{ objectFit: "cover" }} src={guildStatus.nowPlaying.thumbnail} alt="blurred-backdrop" />}
      </BackdropContainer>
      <Container>
        <PlayerHolder>
          <Player>
            {(guildStatus.playing || guildStatus.queue[0]) && <>
              <h1>{guildStatus.nowPlaying?.title || guildStatus.queue[0].title}</h1>
              <h4>{guildStatus.nowPlaying?.author || guildStatus.queue[0].author}</h4>
              <Image width={300} height={300} src={guildStatus.nowPlaying ? guildStatus.nowPlaying.thumbnail ?? "/MissingArtwork.png" : guildStatus.queue[0].thumbnail ?? "/MissingArtwork.png"} alt="album-art" />
              <MediaContainer>
                <MediaButton variant="text" onClick={() => socket.emit("bot-command", {
                  command: "previous",
                  guildId: query.id
                })}>
                  <FaIcon icon={faBackward} />
                </MediaButton>
                <MediaButton variant="text" onClick={() => socket.emit("bot-command", {
                  command: guildStatus.playing ? "pause" : "resume",
                  guildId: query.id
                })}>
                  <FaIcon icon={faPlayPause} />
                </MediaButton>
                <MediaButton variant="text" onClick={() => socket.emit("bot-command", {
                  command: "skip",
                  guildId: query.id
                })}>
                  <FaIcon icon={faForward} />
                </MediaButton>
              </MediaContainer>
            </>}
          </Player>
          {!guildStatus.playing && guildStatus.queue.length <= 0 && <>
            <h1>Nothing is playing</h1>
          </>}
          {guildStatus.queue.length < 0 && <>
            <QueueContainer>
              <h1>Queue</h1>
              {guildStatus.queue.map((track: Track, index: number) => <>
                <ListItem sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  padding: "0 10px",
                }}>
                  <Image width={50} height={50} src={track.thumbnail ?? "/MissingArtwork.png"} alt="thumbnail" />
                  <h2>{index + 1}. {track.title}</h2>
                </ListItem>
                <Divider />
              </>)}
            </QueueContainer>
          </>}
        </PlayerHolder>
        <HeaderHolder>
          {server.icon && <object data={server.icon.includes(".") ? server.icon : `https://cdn.discordapp.com/icons/${server?.id}/${server?.icon}.gif`} type="image/png">
            <Image width={24} height={24} src={server.icon.includes(".") ? server.icon : `https://cdn.discordapp.com/icons/${server?.id}/${server?.icon}.webp`} alt="server_icon" />
          </object>}
          <h4>{server.name}</h4>
        </HeaderHolder>
      </Container>

    </>}
    {status === 'loading' && <>
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    </>}
  </>
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const cookie = getCookie("__Secure-next-auth.session-token", context);
  return {
    props: {
      token: cookie ? cookie.toString() : ""
    }
  };
}

const HeaderHolder = styled(Box)`
  display: flex;
  flex-direction: row;
  padding: 0 20px;
  flex: 0 1 auto;
  align-items: center;
  * {
    font-weight: 300 !important;
  }
  img, object {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 10px;
  }
`

const BackdropContainer = styled(Box)`
  position: absolute;
  height: 100vh !important; 
  width: 100vw; 
  right: 0;
  bottom: 0;
  * { 
    z-index: 1; 
  }

  img {
    height: 120vh !important;
    width: 120vw !important;
    top: -10vh !important;
    left: -10vw !important;
    position: absolute;
    filter: blur(50px) brightness(20%);
  }
  overflow: hidden;
`

const Container = styled(Box)`
  display: flex;
  margin-top: 64px;
  flex-direction: column;
  height: calc(100vh - 64px);
  overflow: hidden;
  * {
    z-index: 2;
  }
`

const MediaContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 0 1 auto;
`

const PlayerHolder = styled(Box)`
  height: auto;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 0 20px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;

  * {
    font-weight: 100;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }
`

const Player = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 0 1 auto;
  img {
    margin: 20px 0;
  }
`

const QueueContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow-y: scroll;
  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
`