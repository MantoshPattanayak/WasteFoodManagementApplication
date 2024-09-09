function formatTime(time24) {   //format 24 hour time as 12 hour time
    if (!time24) return;
    // Parse the input time string
    const [hours, minutes] = time24.split(':').map(Number);

    // Determine AM or PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12; // 0 should be 12 in 12-hour format

    // Format the time string
    const time12 = `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;

    return time12;
}

function formatDateAsDDMMYYYY(date) { //format input date as DD-MM-YYYY
    if (!date) return;
    date = date?.split('T')[0] ? date.split('T')[0] : date;
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
}

function formatDateAsYYYYMMDD(date) { //format input date as DD-MM-YYYY
    if (!date) return;
    const [year, month, day] = date.split('-');
    return `${year}-${month}-${day}`;
}

function truncateName (name, maxLength) {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
};

function calculateTimeDifferenceinHours(startTime, endTime) {
    if(startTime.toString().includes('T') && endTime.toString().includes("T")){ //if datetime as input params then modify as time
        startTime = startTime.split('T')[1].replace("Z", '');
        endTime = endTime.split("T")[1].replace("Z", '');
    }
    const [startHours, startMinutes, StartSeconds] = startTime.split(":").map(Number);
    const [endHours, endMinutes, endSeconds] = endTime.split(":").map(Number);
    const startDate = new Date();
    const endDate = new Date();
    startDate.setHours(startHours, startMinutes, StartSeconds, 0);
    endDate.setHours(endHours, endMinutes, endSeconds, 0);
    let timeDiffMilliseconds = endDate.getTime() - startDate.getTime();

    // If the difference is negative, it means the end time is on the next day
    if (timeDiffMilliseconds < 0) {
        timeDiffMilliseconds += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
    }
    const timeDiffHours = timeDiffMilliseconds / (1000 * 60 * 60);
    return timeDiffHours;
}

export  { formatTime, formatDateAsDDMMYYYY, formatDateAsDDMMYYYY, truncateName, calculateTimeDifferenceinHours }