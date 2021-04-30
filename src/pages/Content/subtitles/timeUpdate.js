export default function timeUpdate(subs, video, pos, setPos) {
  if (subs && subs.length > 1) {
    const time = video.currentTime.toFixed(3);
    let tempPos = pos;
    // See if it's the next or previous position.
    if (
      subs[pos] &&
      subs[pos + 1] &&
      time >= subs[pos].start &&
      time < subs[pos + 1].start
    ) {
      // Don't do anything. "pos" is correct
    } else if (
      subs[pos + 1] &&
      subs[pos + 2] &&
      time >= subs[pos + 1].start &&
      time < subs[pos + 2].start
    ) {
      tempPos = pos + 1;
    } else if (
      subs[pos - 1] &&
      time >= subs[pos - 1].start &&
      time < subs[pos].start
    ) {
      tempPos = pos - 1;
    } else {
      // Look through the whole array to find the correct position
      const newPos = subs.findIndex((el) => el.start > time);
      // If a match was found update "pos"
      if (newPos > 0) {
        tempPos = newPos - 1;
      } else {
        if (time < 200) {
          tempPos = 0;
        } else {
          tempPos = subs.length - 1;
        }
      }
    }

    setPos(tempPos);
    return subs[tempPos].text;
  }
}
