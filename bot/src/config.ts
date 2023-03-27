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
    name: "pause",
    description: "hackrbot pauses playing music",
  },
  {
    name: "resume",
    description: "hackrbot resumes playing music",
  },
  {
    name: "previous",
    description: "hackrbot plays the previous song",
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
    name: "nowplaying",
    description: "hackrbot shows the current song",
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
    name: "autoplay",
    description: "hackrbot enables autoplay",
  },
  {
    name: "loopsong",
    description: "hackrbot loops the current song",
  }
]