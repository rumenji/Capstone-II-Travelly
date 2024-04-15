import moment from 'moment';
import { MenuItem } from "@mui/material";

export const convertDate = (dateString) => {
    const momentDate = moment(dateString, "MM-DD");
    return momentDate.format('MMM D');
}

export const convertTime = (timeString) => {
    const momentTime = moment(timeString, "HH:mm:ss");
    return momentTime.format('hh:mm A')
}

export const userFriendlyDateTime = (date) => {
  return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
}

export const convertYYYYMMDD = (date) => {
  return moment(date).format("YYYY-MM-DD");
}

export const selectTime = () => {
  const times = ['06:15 AM', '08:00 AM']
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