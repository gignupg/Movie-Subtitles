export default function synchronize(data, subsRef, setSubs, originalSubsRef, currentOffsetRef) {
  const subs = subsRef.current;

  if (subs.length > 1) {
    let newTotalOffset;

    if (data.relative) {
      newTotalOffset = currentOffsetRef.current + data.syncValue;
    } else {
      newTotalOffset = data.syncValue;
    }

    const delta = newTotalOffset - currentOffsetRef.current;

    if (delta === 0) {
      return;
    }

    const calibratedSubs = [];
    subs.forEach((elem) => {
      if (elem.music) {
        calibratedSubs.push({
          start: elem.start + delta,
          end: elem.end + delta,
          text: elem.text,
          music: {
            text: elem.music.text,
            start: elem.music.start + delta,
            end: elem.music.end + delta,
          },
        });
      } else {
        calibratedSubs.push({
          start: elem.start + delta,
          end: elem.end + delta,
          text: elem.text,
        });
      }
    });

    subsRef.current = calibratedSubs;
    currentOffsetRef.current = newTotalOffset;
    setSubs(calibratedSubs);
  }
}
