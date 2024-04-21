import moment from 'moment';
import { MenuItem } from "@mui/material";

/**Convert date from numbers to words: 04-05 => Apr 5 */
export const convertDate = (dateString) => {
  const momentDate = moment(dateString, "MM-DD");
  return momentDate.format('MMM D');
}

/**Converts time to AM/PM */
export const convertTime = (timeString) => {
  const momentTime = moment(timeString, "HH:mm:ss");
  return momentTime.format('hh:mm A')
}

/**Converts datetime string to user friendly string */
export const userFriendlyDateTime = (date) => {
  return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
}

/**Converts datetime to YYYY-MM-DD */
export const convertYYYYMMDD = (date) => {
  console.log(date)
  return moment(date).format("YYYY-MM-DD");
}

/**Generates the options for a dropdown for times of day */
export const selectTime = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  return hours.flatMap((hour) =>
    minutes.map((minute) => {
      const isPM = hour >= 12;
      const formattedHour = hour % 12 === 0 ? 12 : (`0${hour % 12}`).slice(-2); // Pad hours
      const formattedMinute = (`0${minute}`).slice(-2); // Pad minutes
      const timeString = `${formattedHour}:${formattedMinute} ${isPM ? 'PM' : 'AM'}`;

      return <MenuItem key={timeString} value={timeString}>{timeString}</MenuItem>;
    })
  );
};