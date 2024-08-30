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

module.exports ={
    validateAndConvertDate
    ,validateTimeFormat
}