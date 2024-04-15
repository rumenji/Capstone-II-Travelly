// Import the function to be tested
const {dateRange} = require('./dateRange');

// Test suite for dateRange function
describe('dateRange', () => {
  // Test case 1: Start and end date are the same
  it('should return the day in the array when start and end date are the same', () => {
    const startDate = '2023-07-31';
    const endDate = '2023-07-31';
    const expectedOutput = ["07-31"];
    const actualOutput = dateRange(startDate, endDate);
    expect(actualOutput).toEqual(expectedOutput);
  });

  // Test case 2: Start date is before end date
  it('should return an array of dates between start and end date', () => {
    const startDate = '2023-07-31';
    const endDate = '2023-08-04';
    const expectedOutput = ['07-31', '08-01', '08-02', '08-03', '08-04'];
    const actualOutput = dateRange(startDate, endDate);
    expect(actualOutput).toEqual(expectedOutput);
  });

  // Test case 3: Start date is after end date
  it('should return an empty array when start date is after end date', () => {
    const startDate = '2023-08-05';
    const endDate = '2023-08-04';
    const expectedOutput = [];
    const actualOutput = dateRange(startDate, endDate);
    expect(actualOutput).toEqual(expectedOutput);
  });
});