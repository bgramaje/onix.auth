export const parseDuration = (durationStr : string) => {
  const durationRegex = /^(\d+)([smhdwy])$/;
  const match = durationStr.match(durationRegex);

  if (!match) {
    throw new Error('Invalid duration format');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  let durationObj = {};
  switch (unit) {
    case 's':
      durationObj = { seconds: value };
      break;
    case 'm':
      durationObj = { minutes: value };
      break;
    case 'h':
      durationObj = { hours: value };
      break;
    case 'd':
      durationObj = { days: value };
      break;
    case 'w':
      durationObj = { weeks: value };
      break;
    case 'y':
      durationObj = { years: value };
      break;
    default:
      throw new Error('Unknown duration unit');
  }

  return durationObj;
};
