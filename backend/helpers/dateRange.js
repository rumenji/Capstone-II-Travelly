function dateRange(startDate, endDate){
    let listDate = [];
    const dateMove = new Date(startDate);
    let strDate = startDate;

    while (strDate < endDate){
    strDate = dateMove.toISOString().slice(0,10);
    listDate.push(strDate.slice(5,10));
    dateMove.setDate(dateMove.getDate()+1);
    };
    return listDate;
}

module.exports = { dateRange };