/**Function to create a list of days from a date range
 * Expects the start and to dates
 * Returns a list [MM-DD, ...]
 */
function dateRange(startDate, endDate) {
  let listDate = [];
  const dateMove = new Date(startDate);
  let strDate = startDate;

  if (startDate === endDate) {
    listDate.push(strDate.slice(5, 10));
  }
  else {
    while (strDate < endDate) {
      strDate = dateMove.toISOString().slice(0, 10);
      listDate.push(strDate.slice(5, 10));
      dateMove.setDate(dateMove.getDate() + 1);
    };
  }
  return listDate;
}

/**Function to get the days to be added to a trip after a user changes trip dates 
 * Expects the new from and to dates, and the current days
 * Returns a list of days to be added
*/
function getDaysToAdd(fromDate, toDate, existingDays) {
  const dates = [];
  let currentDate = new Date(fromDate);

  while (currentDate <= new Date(toDate)) {
    const strDate = currentDate.toISOString().substring(0, 10); // YYYY-MM-DD
    const formattedDate = strDate.slice(5, 10)
    if (!existingDays.includes(formattedDate)) {
      dates.push(formattedDate);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**Function to get the days to be removed from a trip after a user changes trip dates
 * Expects the new from and to dates, and the current days
* Returns a list of days to be removed
 */
function getDaysToDelete(fromDate, toDate, existingDays) {
  const dates = [];
  let firstDate = new Date(fromDate)
  const strFromDate = firstDate.toISOString().substring(0, 10); // YYYY-MM-DD
  const formattedFromDate = strFromDate.slice(5, 10)
  let lastDate = new Date(toDate)
  const strToDate = lastDate.toISOString().substring(0, 10); // YYYY-MM-DD
  const formattedToDate = strToDate.slice(5, 10)
  for (const date of existingDays) {
    if (date < formattedFromDate || date > formattedToDate) {
      dates.push(date);
    }
  }
  return dates;
}

module.exports = { dateRange, getDaysToAdd, getDaysToDelete };