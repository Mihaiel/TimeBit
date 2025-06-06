document.querySelector('.submit-entry').addEventListener('click', async (e) => {
    e.preventDefault();

    const userEmail = document.querySelector('#user_email').value;

    const timeEntryData = {
        startTime: document.querySelector('#starting_time').value,
        endTime: document.querySelector('#ending_time').value,
        description: document.querySelector('textarea').value,
    };

    try {
        const response = await fetch('/api/time-entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail, timeEntryData}),
        });

        if (response.ok) {
            alert('Time entry saved successfully and notification sent!');
        } else {
            alert('Failed to save time entry. Please try again.');
        }
    } catch (error) {
        alert('Error saving time entry: ' + error.message);
    }
});