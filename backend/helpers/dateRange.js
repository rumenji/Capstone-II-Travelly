function dateRange(startDate, endDate){
    let listDate = [];
    const dateMove = new Date(startDate);
    let strDate = startDate;

    if (startDate === endDate) {
        listDate.push(strDate.slice(5,10));
      }
      else {
        while (strDate < endDate){
        strDate = dateMove.toISOString().slice(0,10);
        listDate.push(strDate.slice(5,10));
        dateMove.setDate(dateMove.getDate()+1);
        };
    }
    return listDate;
}

function getDaysToAdd(fromDate, toDate, existingDays) {
    const dates = [];
    let currentDate = new Date(fromDate); // Ensure fromDate is a Date object
  
    while (currentDate <= new Date(toDate)) { // Ensure toDate is a Date object
      const strDate = currentDate.toISOString().substring(0, 10); // YYYY-MM-DD
      const formattedDate = strDate.slice(5,10)
      if (!existingDays.includes(formattedDate)) {
        dates.push(formattedDate); // Push as string for easier comparison
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }

  function getDaysToDelete(fromDate, toDate, existingDays) {
    const dates = [];
    let firstDate = new Date(fromDate)
    const strFromDate = firstDate.toISOString().substring(0, 10); // YYYY-MM-DD
    const formattedFromDate = strFromDate.slice(5,10)
    let lastDate = new Date(toDate)
    const strToDate = lastDate.toISOString().substring(0, 10); // YYYY-MM-DD
    const formattedToDate = strToDate.slice(5,10)
    for (const date of existingDays) {
      if (date < formattedFromDate || date > formattedToDate) {
        dates.push(date);
      }
    }
    return dates;
  }

module.exports = { dateRange, getDaysToAdd, getDaysToDelete };