import timeInSeconds from './timeInSeconds';

export default function processSubtitles(content, subsRef, setSubs) {
  const newSubs = [];
  const emptyLines = [];
  const musicRegEx = new RegExp(/♪|\[Music\]/);
  let count = 0;
  let type = null;
  let previousTextWithoutHtml = { text: null, count: -1 };
  let prevLine = null;
  let curlyBraces = 0;

  // Determine the subtitle format to choose the appropriate method for reading them!
  for (let i = 50; i < 60; i++) {
    const line = content[i].trim();
    if (/{.*}{.*}/.test(line)) {
      curlyBraces++;
    }
  }

  // Use Method 1 to read the subtitles
  if (curlyBraces >= 7) {
    for (let i = 0; i < content.length; i++) {
      const line = content[i].trim().replace(/\n/g, '');
      const split = line.split(/[{}|]/g).filter((e) => e);

      // Only lines that contain text! Empty lines will be skipped...
      if (split.length > 2) {
        const start = split[0];
        const end = split[1];
        const formatting = split.some((elem) => /y:/.test(elem));
        const music = split.some((elem) => musicRegEx.test(elem));
        const text = split
          .reduce(
            (acc, val) => (/[{}\d\|(y:)]/g.test(val) ? acc : acc + ' ' + val),
            ''
          )
          .trim();

        if (text && start && end) {
          const node = {};

          // Make sure it's a number!
          node.start = Number((Number(start) / (24000 / 1001)).toFixed(3)); // 24000 / 1001 = 23.976 frame/s
          node.end = Number((Number(end) / (24000 / 1001)).toFixed(3)); // // 24000 / 1001 = 23.976 frame/s

          if (formatting) {
            const format = split.reduce(
              (acc, val) => (/y:/.test(val) ? val.replace(/y:/, '') : acc),
              ''
            );
            node.text = `<${format}>${text}</${format}>`;
          } else {
            node.text = text;
          }

          if (music) node.music = {};

          newSubs.push(node);
        }
      }
    }

    // Use Method 2 to read the subtitles
  } else {
    newSubs.push({ text: '' });
    for (let i = 0; i < content.length; i++) {
      const line = content[i].trim().replace(/\n/g, '');

      if (type === 'time') {
        if (count >= newSubs.length) break;

        const split = line.split(/ --> /);
        if (split.length !== 2) continue;

        type = 'text';
        const start = timeInSeconds(split[0]);
        const end = timeInSeconds(split[1]);

        // Updating the object
        newSubs[count].start = Number(start);
        newSubs[count].end = Number(end);

      } else if (type === 'text') {
        // If the next line is empty, set the type for the next i to null!
        if (i + 1 < content.length) {
          const nextLineEmpty = !content[i + 1].trim();
          if (nextLineEmpty) {
            type = null;
          }
        }

        // Removing html tags, because they do not count as text.
        const textWithoutHtml = line.replace(/\<\/*.*?\>/g, '');
        // If this line doesn't contain word characters and the next line contains no text at all push "count" into the empty array so it can be removed later on
        if (!textWithoutHtml && type === null) {
          // If the current node has one line
          if (previousTextWithoutHtml.count !== count) {
            emptyLines.push(count);

            // If the current node has two lines or more
          } else if (!previousTextWithoutHtml.text) {
            // If the previous line has the same count and doesn't contain word characters either
            emptyLines.push(count);
          }
        }
        previousTextWithoutHtml = { text: textWithoutHtml, count: count };

        newSubs[count].text += line + ' ';

        const music = musicRegEx.test(newSubs[count].text);

        // If it's music
        if (music) {
          newSubs[count].music = {};
        }
      } else if (!line) {
        if (i > 0 && !prevLine) {
          // Don't increase the count! It's just an empty line...
        } else {
          count++;
        }
      } else if (!isNaN(line)) {
        type = 'time';
        newSubs.push({ text: '' });
      }

      prevLine = line;
    }
  }

  // Delete all empty lines! We only want to keep lines that contain word characters!
  for (let b = emptyLines.length - 1; b >= 0; b--) {
    newSubs.splice([emptyLines[b]], 1);
  }

  // Delete the last node in the subtitle array if it has no text
  if (!newSubs[newSubs.length - 1].text.trim()) newSubs.pop();

  // Adding "Skip Start" manually
  if (newSubs[0].start > 5) {
    newSubs.unshift({
      text: 'Silence (' + Math.round(newSubs[0].start) + ' seconds)',
      start: 0,
      end: newSubs[0].start,
    });
  }

  // Adding "(end)" manually
  const lastNode = newSubs[newSubs.length - 1];
  lastNode.text = lastNode.text + '(end)';

  // Adding "Skip silence" to our subtitle array (newSubs) and updating the music property
  for (let i = 1; i < newSubs.length; i++) {
    // Adding silence
    const silence = newSubs[i].start - newSubs[i - 1].end;

    if (silence > 5) {
      newSubs.splice(i, 0, {
        text: 'Silence (' + Math.round(silence) + ' seconds)',
        start: newSubs[i - 1].end,
        end: newSubs[i].start,
      });
    }

    // Adding music
    if (newSubs[i].music) {
      const music = newSubs[i].music;
      music.start = newSubs[i].start;

      // Find the end
      for (let j = i; j < newSubs.length; j++) {
        if (!newSubs[j].music) {
          music.end = newSubs[j].start;
          break;
        }
      }

      // If no end was found we must be at the end of the subtitle array
      if (!music.end) {
        music.end = newSubs[newSubs.length - 1].end;
      }

      music.text =
        'Music (' + (music.end - music.start).toFixed() + ' seconds)';
    }
  }

  subsRef.current = newSubs;
  setSubs(newSubs);
}
