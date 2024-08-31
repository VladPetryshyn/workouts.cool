export const timeFromMilis = (milis: number) => {
  const date = new Date(milis);
  const minutes = date.getMinutes();
  const formattedMins = minutes > 9 ? minutes : "0" + minutes;

  const seconds = date.getSeconds();
  const formattedSec = seconds > 9 ? seconds : "0" + seconds;

  return `${formattedMins}:${formattedSec}`;
};
