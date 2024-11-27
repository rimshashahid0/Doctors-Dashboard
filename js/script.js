// ==============================================================================================================================//
// =================================================Sidebar Hide and Menu Toggle=================================================// 
// ==============================================================================================================================//


// Get references to elements
const menuBar = document.querySelector('#content nav .menu-icon');
const sidebar = document.getElementById('sidebar');

// Disable sidebar transition initially to prevent a jump on page load
sidebar.classList.add('sidebar-no-transition');

// On DOM load, restore sidebar state based on localStorage
document.addEventListener('DOMContentLoaded', function () {
    const sidebarState = localStorage.getItem('sidebarState');
    
    // Apply the saved sidebar state (hide/show) before removing the preload class
    if (sidebarState === 'hidden') {
        sidebar.classList.add('hide'); // Keep sidebar hidden
    } else {
        sidebar.classList.remove('hide'); // Keep sidebar visible
    }

    // Re-enable sidebar transitions and remove preload after state restoration
    setTimeout(() => {
        sidebar.classList.remove('sidebar-no-transition');
        sidebar.classList.remove('preload'); // Remove the preload class to show the sidebar properly
    }, 0);
});

// Toggle sidebar visibility when the menu icon is clicked
menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide'); // Toggle the 'hide' class

    // Save the new sidebar state to localStorage
    if (sidebar.classList.contains('hide')) {
        localStorage.setItem('sidebarState', 'hidden'); // Save as hidden
    } else {
        localStorage.setItem('sidebarState', 'visible'); // Save as visible
    }
});



// ==============================================================================================================================//
// =================================================Sidebar List Active==========================================================// 
// ==============================================================================================================================//

const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});


// ==============================================================================================================================//
// ==================================================navbar Dropdown Menu Toggle=================================================// 
// ==============================================================================================================================//

const dropdownToggle = document.getElementById('dropdown-toggle');
const dropdownMenu = document.getElementById('dropdown-menu');

dropdownToggle.addEventListener('click', function (event) {
    event.preventDefault(); 

    dropdownMenu.classList.toggle('show');
});

document.addEventListener('click', function (event) {
    if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('show');
    }
});



// ==============================================================================================================================//
// =========================================================Dark Switch Mode=====================================================// 
// ==============================================================================================================================//

const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
})

