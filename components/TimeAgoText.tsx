//Gaire Ananta Prasad M24W0272
'use client'; // Indicates this is a client-side component

import ReactTimeago from "react-timeago"; // Import ReactTimeago component for displaying time ago

// TimeAgoText component to display time ago based on provided date
function TimeAgoText({ date }: { date: string }) {
    return (
        <ReactTimeago date={date} /> // Render ReactTimeago component with specified date
    );
}

export default TimeAgoText; // Export TimeAgoText component as default
