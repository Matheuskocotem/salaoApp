
const timeUtils = {
  hourToMinutes: (hourMinute) => {
    const [hour, minutes] = hourMinute.split(':');
    return parseInt(parseInt(hour) * 60 + parseInt(minutes));
  },
};

export default timeUtils;
