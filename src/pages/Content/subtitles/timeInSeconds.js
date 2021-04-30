export default function timeInSeconds(time) {
  const split = time.split(/:|,/);

  const s1 = Number(split[0] * 60 * 60); // hours
  const s2 = Number(split[1] * 60); // minutes
  const s3 = Number(split[2]); // seconds
  const s4 = split[3]; // milliseconds

  const seconds = s1 + s2 + s3;
  return seconds + '.' + s4;
}
