export const commands  = [
  {
    name: "leave",
    description: "hackrbot leaves the voice channel it is in",
  },
  {
    name: "join",
    description: "hackrbot joins the voice channel you are in",
  },
  {
    name: "play",
    description: "hackrbot plays a song in the voice channel you are in",
    options: [
      {
        name: "song",
        description: "the song to play",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "stop",
    description: "hackrbot stops playing music",
  },
  {
    name: "pause",
    description: "hackrbot pauses playing music",
  },
  {
    name: "resume",
    description: "hackrbot resumes playing music",
  },
  {
    name: "skip",
    description: "hackrbot skips the current song",
  },
  {
    name: "queue",
    description: "hackrbot shows the current queue",
  },
  {
    name: "clear",
    description: "hackrbot clears the current queue",
  },
  {
    name: "shuffle",
    description: "hackrbot shuffles the current queue",
  },
  {
    name: "loop",
    description: "hackrbot loops the current queue",
  },
  {
    name: "unloop",
    description: "hackrbot unloops the current queue",
  },
  {
    name: "volume",
    description: "hackrbot sets the volume",
    options: [
      {
        name: "volume",
        description: "the volume to set",
        type: 4,
        required: true,
      },
    ],
  },
  {
    name: "seek",
    description: "hackrbot seeks to a certain time in the current song",
    options: [
      {
        name: "time",
        description: "the time to seek to",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "nowplaying",
    description: "hackrbot shows the current song",
  },
  {
    name: "lyrics",
    description: "hackrbot shows the lyrics of the current song",
  },
  {
    name: "search",
    description: "hackrbot searches for a song",
    options: [  
      {
        name: "song",
        description: "the song to search for",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "remove",
    description: "hackrbot removes a song from the queue",
    options: [
      {
        name: "index",
        description: "the index of the song to remove",
        type: 4,
        required: true,
      },
    ],
  },
  {
    name: "move",
    description: "hackrbot moves a song in the queue",
    options: [
      {
        name: "index",
        description: "the index of the song to move",
        type: 4,
        required: true,
      },
      {
        name: "position",
        description: "the position to move the song to (defaults to the start of the queue)",
        type: 4,
        required: false,
      },
    ],
  },
  {
    name: "playnext",
    description: "hackrbot plays a song next in the queue",
    options: [
      {
        name: "song",
        description: "the song to play next",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "playlater",
    description: "hackrbot plays a song later in the queue",
    options: [
      {
        name: "song",
        description: "the song to play later",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "playnow",
    description: "hackrbot plays a song now in the queue",
    options: [
      {
        name: "song",
        description: "the song to play now",
        type: 3,
        required: true,
      },
    ],
  }
]