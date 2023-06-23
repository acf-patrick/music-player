type EventType =
  | {
      event: "queue change";
      data: string[]; // list of song ID
    }
  | {
      event: "play";
    }
  | {
      event: "pause";
    };

export default EventType;
