import styled from "@emotion/styled"
import { Box, CircularProgress } from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"


export default function Server() {
  const { data, status } = useSession()
  const { query } = useRouter()
  const server = data?.user?.servers?.find(server => server.id === query.id)
  return <>
    {status === 'authenticated' && <>
      <Box sx={{ display: 'flex', marginTop: '64px' }}>
        <HeaderHolder sx={{ flexGrow: 1, padding: "0 20px", flexDirection: "row", display: "flex" }}>
          {server?.icon && <object data={server.icon.includes(".") ? server.icon : `https://cdn.discordapp.com/icons/${server?.id}/${server?.icon}.gif`} type="image/png">
            <img src={server.icon.includes(".") ? server.icon : `https://cdn.discordapp.com/icons/${server?.id}/${server?.icon}.webp`} />
          </object>}
          <h1>{server?.name}</h1>
        </HeaderHolder>
      </Box>
    </>}
    {status === 'loading' && <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    </>}
  </>
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