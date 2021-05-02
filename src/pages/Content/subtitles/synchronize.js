export default function synchronize(data, subsRef, setSubs) {
  const subs = subsRef.current;

  if (subs.length > 1) {
    let offset = 0;

    if (!data.syncLater) {
      offset = data.syncValue * -1;
    } else {
      offset = data.syncValue;
    }

    // Calculate the new start and end times for the whole subtitle array
    const calibratedSubs = [];
    subs.forEach((elem) => {
      if (elem.music) {
        calibratedSubs.push({
          start: elem.start + offset,
          end: elem.end + offset,
          text: elem.text,
          music: {
            text: elem.music.text,
            start: elem.music.start + offset,
            end: elem.music.end + offset,
          },
        });
      } else {
        calibratedSubs.push({
          start: elem.start + offset,
          end: elem.end + offset,
          text: elem.text,
        });
      }
    });

    subsRef.current = calibratedSubs;
    setSubs(calibratedSubs);
  }
}
