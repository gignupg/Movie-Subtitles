import timeInSeconds from './timeInSeconds';

function isAssSubtitle(content) {
  return content.some((line) => /^\s*\[Events\]\s*$/i.test(line));
}

function assTimeInSeconds(time) {
  const split = time.trim().split(/:|\./);

  const hours = Number(split[0] * 60 * 60);
  const minutes = Number(split[1] * 60);
  const seconds = Number(split[2]);
  const centiseconds = Number((split[3] || '0').padEnd(3, '0')) / 1000;

  return Number((hours + minutes + seconds + centiseconds).toFixed(3));
}

function splitAssFields(line, format) {
  const parts = line.split(',');
  const textIndex = format.indexOf('text');

  if (parts.length <= format.length || textIndex === -1) return parts;

  const extraParts = parts.length - format.length;
  const beforeText = parts.slice(0, textIndex);
  const text = parts.slice(textIndex, textIndex + extraParts + 1).join(',');
  const afterText = parts.slice(textIndex + extraParts + 1);

  return beforeText.concat(text, afterText);
}

function closeAssTag(openTags, tag) {
  const index = openTags.lastIndexOf(tag);
  if (index === -1) return '';

  let html = '';
  const tagsToReopen = openTags.slice(index + 1);

  for (let i = openTags.length - 1; i >= index; i--) {
    html += `</${openTags[i]}>`;
  }

  openTags.splice(index);

  tagsToReopen.forEach((tagToReopen) => {
    html += `<${tagToReopen}>`;
    openTags.push(tagToReopen);
  });

  return html;
}

function convertAssFormatting(commands, openTags) {
  const tagMap = { b: 'b', i: 'i', u: 'u', s: 's' };
  let html = '';
  let match;
  const commandRegEx = /\\([biusr])(-?\d+)?/gi;

  while ((match = commandRegEx.exec(commands))) {
    const command = match[1].toLowerCase();
    const value = match[2];

    if (command === 'r') {
      while (openTags.length) html += `</${openTags.pop()}>`;
      continue;
    }

    const tag = tagMap[command];
    if (!tag) continue;

    if (value === '0') {
      html += closeAssTag(openTags, tag);
    } else if (!openTags.includes(tag)) {
      html += `<${tag}>`;
      openTags.push(tag);
    }
  }

  return html;
}

function assTextToHtml(text) {
  const openTags = [];
  let html = '';
  let lastIndex = 0;
  const preparedText = text.replace(/\\N|\\n/g, '<br />').replace(/\\h/g, ' ');
  const overrideRegEx = /\{([^}]*)\}/g;
  let match;

  while ((match = overrideRegEx.exec(preparedText))) {
    html += preparedText.slice(lastIndex, match.index);
    html += convertAssFormatting(match[1], openTags);
    lastIndex = match.index + match[0].length;
  }

  html += preparedText.slice(lastIndex);

  while (openTags.length) html += `</${openTags.pop()}>`;

  return html.trim();
}

function processAssSubtitles(content, newSubs, musicRegEx) {
  let inEvents = false;
  let format = [];

  for (let i = 0; i < content.length; i++) {
    const line = content[i].trim().replace(/\r/g, '');

    if (/^\[.*\]$/.test(line)) {
      inEvents = /^\[Events\]$/i.test(line);
      continue;
    }

    if (!inEvents) continue;

    if (/^Format\s*:/i.test(line)) {
      format = line
        .replace(/^Format\s*:/i, '')
        .split(',')
        .map((field) => field.trim().toLowerCase());
      continue;
    }

    if (!/^Dialogue\s*:/i.test(line) || !format.length) continue;

    const fields = splitAssFields(line.replace(/^Dialogue\s*:/i, ''), format);
    const start = fields[format.indexOf('start')];
    const end = fields[format.indexOf('end')];
    const text = fields[format.indexOf('text')];

    if (!start || !end || !text) continue;

    const node = {
      start: assTimeInSeconds(start),
      end: assTimeInSeconds(end),
      text: assTextToHtml(text),
    };

    if (musicRegEx.test(node.text)) node.music = {};

    newSubs.push(node);
  }
}

export default function processSubtitles(content, subsRef, setSubs) {
  const newSubs = [];
  const emptyLines = [];
  const musicRegEx = new RegExp(/♪|\[Music\]/);
  let count = 0;
  let type = null;
  let previousTextWithoutHtml = { text: null, count: -1 };
  let prevLine = null;
  let curlyBraces = 0;

  if (isAssSubtitle(content)) {
    processAssSubtitles(content, newSubs, musicRegEx);
  } else {
    // Determine the subtitle format to choose the appropriate method for reading them!
    for (let i = 50; i < 60; i++) {
      if (content[i]) {
        const line = content[i].trim();
        if (/{.*}{.*}/.test(line)) {
          curlyBraces++;
        }
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
