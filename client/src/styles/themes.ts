const themes = {
  colors: {
    text: "black",
    background: "#EFEFEF",
    bgSecondary: "#E3E3E3",
    option: "#101010",
    albumName: "#505050",
    placeholder: "rgba(0, 0, 0, 0.3)",
    tooltip: {
      text: "white",
      background: "black",
    },
    player: {
      line: "#7000FF",
      color: "#464646",
      activated: "#655DBB",
    },
    album: {
      cover: "grey",
      artist: {
        gridCell: "black",
        listItem: "grey",
      },
      page: {
        artist: "#2F2F2F",
        name: "#4D4D4D",
      },
    },
    song: {
      title: "#303030",
      border: "rgba(0, 0, 0, 0.6)",
      color: "black",
      playing: "rgba(0, 0, 0, 0.125)",
      borderBottom: "rgba(0, 0, 0, 0.06)",
      bgHovered: "rgba(255, 255, 255, 0.29)",
      cover: {
        background: "#2d2727",
        color: "white",
      },
    },
    homeContentBg: {
      start: "#D3C8D3",
      end: "#DAD3D5",
    },
    contextMenu: {
      text: "#7F868D",
      separator: "#CFCFCF",
      background: "rgba(255, 255, 255, 0.7)",
      searchbar: "rgba(117, 117, 117, 0.2)",
      hovered: {
        text: "black",
        background: "rgba(43, 43, 43, 0.11)",
      },
    },
    hovered: {
      background: "#BFACE2",
      border: "#655DBB",
    },
    active: { background: "white" },
  },
  spacings: {
    padding: "2.5rem",
    margin: "0.5rem",
  },
  borderRadius: "10px",
  sizes: {
    minWidth: "1280px",
    minHeight: "720px",
    contextMenu: {
      minWidth: "128px",
      maxWidth: "228px",
      maxHeight: "148px",
    },
    image: {
      sm: "48px",
      md: "64px",
      lg: "144px",
    },
  },
};

export default themes;
