const moment = require("moment");

/**
 * function to validate and convert to YYYY-MM-DD
 * @param {string} dateString 
 * @returns {boolean, string} isValid, data
 */
function validateAndConvertDate(dateString) {
    // Define the acceptable date formats
    // console.log("validateAndConvertDate func dateString", dateString);
    const formats = [
        "DD/MM/YYYY",
        "DD-MM-YYYY",
        "MM/DD/YYYY",
        "MM-DD-YYYY"
    ];

    // Check if the date string is valid according to any of the specified formats
    const isValid = formats.some(format => moment(dateString, format, true).isValid());
    
    if (isValid) {
        // Attempt to parse the date and convert it to YYYY-MM-DD format
        const parsedDate = moment(dateString, formats, true);
        
        if (parsedDate.isValid()) {
            // console.log("date parsing", parsedDate.format("YYYY-MM-DD"));
            return { isValid: true, data: parsedDate.format("YYYY-MM-DD") }; // Return the converted date
        } else {
            return { isValid: false, data: null }; // Return an error message if parsing fails
        }
    }
    else {
        return { isValid: false, data: null };
    }
}

/**
 * function to validate time input
 * @param {string} timeString 
 * @returns 
 */
function validateTimeFormat(timeString) {
    // Define the acceptable time format
    const timeFormat = "HH:mm:ss";

    // Check if the time string is valid according to the specified format
    const isValid = moment(timeString, timeFormat, true).isValid();

    return isValid;
}

/**
 * function to current formate date as DDMMYYYYHHMMSSMS
 * @returns formattedDate
 */
function formatDateToDDMMYYYYHHMMSSMS() {
    const now = new Date();
    // Extract individual date and time components
    const day = String(now.getDate()).padStart(2, '0'); // Day (2 digits)
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month (2 digits, 0-indexed)
    const year = now.getFullYear(); // Year (4 digits)
    const hours = String(now.getHours()).padStart(2, '0'); // Hours (2 digits)
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutes (2 digits)
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Seconds (2 digits)
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Milliseconds (3 digits)
  
    // Combine components into the desired format
    const formattedDate = `${day}${month}${year}${hours}${minutes}${seconds}${milliseconds}`;
    return formattedDate;
  }

module.exports ={
    validateAndConvertDate
    ,validateTimeFormat
    ,formatDateToDDMMYYYYHHMMSSMS
}