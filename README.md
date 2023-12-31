# TIMER BUDDY
### Video Demo  <https://youtu.be/lbh28RMNI7U>

### Description
#### TD;LR
Timer Buddy is a simple Chrome extension which helps track time spent on sites.

#### Features
1. Time Tracking:
   Timer Buddy automatically tracks the time you spend on different websites, helping you monitor and manage your online activities.

2. Real-time Display:
   The extension updates the time spent on the current site in real-time, providing immediate feedback to users.

3. Domain-Based Tracking:
   Timer Buddy organizes time tracking based on domains, giving you an overview of how much time you've spent on each site.

4. Local Storage:
   All time-tracking data is stored locally using Chrome's local storage, ensuring persistence and allowing users to review their browsing history.

5. Log Deletion:
   Users can selectively remove logs for specific sites, providing flexibility and control over the displayed information.

#### Details
Timer Buddy is a simple lightweight Chrome extension built using vanilla javascript that tracks the time spent on sites.
This extension works around domains meaning it will track how long you have stayed in a specific site but as for this version 
it does not display all the pages you have visited, It will simply show the site name and the total amount of time spent on it. 
For each page that you visit that is within that site the total time for that site will increase for as long as you stay on that page,
meaning for as long as that page is active. To check weather the page is active the extension uses the chrome active tabs listen events.
The extension popup is updated every second with the latest data. Closing the tab does not affect the data as the data is not stored based on tabId, it is stored 
based on sites. The data is stored in chrome local storage, so that you can always keep track of the pages you visit and the time you spent on them, no matter if
the tab or the window is closed. The only way to remove the data for a site is from a button that is present on the extension popup. 
For each line on the table, representing each domain for which we are tracking time, there is a button, that on click triggers an event that removes
the data from the chrome storage.

### Styles
1. Minimalistic Design:
   Timer Buddy embraces a minimalistic design, ensuring a clean user interface.

2. Intuitive Popup:
   The extension's popup provides a straightforward display of site names and their corresponding total times, enhancing user experience.

3. User-Friendly Controls:
   The extension features a simple button to delete logs, making it easy for users to manage their tracked data.

### Installation
1. Download the extension files from the repository.
2. Open Google Chrome.
3. Navigate to `chrome://extensions/`.
4. Enable "Developer mode" in the top right corner.
5. Click on "Load unpacked" and select the folder containing your extension files.

### Contact
For further questions you can contact me at my email: nittaluta@gmail.com
