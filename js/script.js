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



// ==============================================================================================================================//
// ========================Adding new patient with updating the table and checkbox functionality=================================// 
// ==============================================================================================================================//


$(document).ready(function() {
    var patientTable = $('#patientTable').DataTable({
        "paging": true,
        "searching": true,
        "ordering": true,
        "columnDefs": [
          { "orderable": false, "targets": 0 } // Disables sorting on the first column (checkboxes)
        ]
      });
  
    var deletePatientId; // Variable to hold patient ID for deletion
    var editPatientId; // Variable to hold patient ID for editing
  
    // Load patients from localStorage when the page loads
    loadPatients();
  
    // Select All Checkboxes functionality
    $('#selectAll').click(function() {
      var isChecked = $(this).is(':checked');
      $('.rowCheckbox').prop('checked', isChecked);
    });
  
    // Uncheck "Select All" if any row checkbox is unchecked
    $('.rowCheckbox').click(function() {
      if (!$(this).is(':checked')) {
        $('#selectAll').prop('checked', false);
      }
    });
  
   // Add Patient Form Submission
   $('#addPatientForm').on('submit', function(e) {
    e.preventDefault(); // Prevent form submission

    // Disable the submit button to avoid multiple clicks
    $('.addpatient').prop('disabled', true);

    // Get the input values
    var name = $('#patientName').val();
    var age = $('#patientAge').val();
    var gender = $('#patientGender').val();
    var details = $('#patientDetails').val();

    // Log the values to check if inputs are being captured correctly
    console.log("Captured Values - Name: " + name + ", Age: " + age + ", Gender: " + gender + ", Details: " + details);

    // Check if input values are valid (simple validation)
    if (!name || !age || !gender || !details) {
        alert("Please fill in all fields.");
        $('.addpatient').prop('disabled', false);
        return; // Exit if validation fails
    }

    // Get the current number of rows (for the numbering)
    var patientNumber = patientTable.rows().count() + 1;

    // Create the new patient object with an empty tests array
    var newPatient = {
        id: patientNumber,
        name: name,
        age: age,
        gender: gender,
        details: details,
        tests: [], // Initialize with an empty array for tests
        status: "active"
    };

    // Log the new patient object for debugging
    console.log("New Patient Object: ", newPatient);

    // Save the new patient to localStorage
    let patients = JSON.parse(localStorage.getItem('patients')) || [];
    patients.push(newPatient);
    localStorage.setItem('patients', JSON.stringify(patients));

    // Log the updated localStorage data for debugging
    console.log("Updated Patients List in localStorage: ", patients);

    // Add the new patient row into the DataTable
    patientTable.row.add([
        '<input type="checkbox" name="checkbox" class="rowCheckbox">',
        patientNumber,
        name,
        age,
        gender,
        '<td class="details">' + truncateText(details, 20) + '</td>', // Truncate details text
        '<span class="action-icons">' +
          '<a href="#" class="view-icon" data-id="' + patientNumber + '" title="View"><span class="material-symbols-sharp table-icons">visibility</span></a>' +
          '<a href="#" class="edit-icon" data-id="' + patientNumber + '" title="Edit"><span class="material-symbols-sharp table-icons">edit</span></a>' +
          '<a href="#" class="delete-icon" data-id="' + patientNumber + '" title="Delete"><span class="material-symbols-sharp table-icons">delete</span></a>' +
          '<a href="#" class="assign-tests" data-id="' + patientNumber + '" title="Assign Tests"><span class="material-symbols-sharp table-icons">assignment</span></a>' +
        '</span>',
        '<input type="checkbox" name="testcheckbox" class="testCheckbox"> ' +
        '<a href="#" class="assign-tests test-count" data-id="' + patientNumber + '">' + newPatient.tests.length + ' Tests</a>',
        '<label class="active tablelabel"><input type="radio" class="activecolor" name="status' + patientNumber + '" value="active" checked> Active</label>' +
        '<label  class="tablelabel"><input type="radio" class="inactivecolor" name="status' + patientNumber + '" value="inactive"> Inactive</label>'
    ]).draw(false);

    // Log DataTable after the row is added
    console.log("Patient added to DataTable.");

    // Clear the form inputs after submission
    $('#addPatientForm')[0].reset();
    console.log("Form reset.");

      // Close the modal after submission
      modal.style.display = "none"; // This hides the modal
      
    // Re-enable the submit button for future submissions
    $('.addpatient').prop('disabled', false);
});

// Function to truncate text for the "details" column
function truncateText(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
}



  
// Load patients from localStorage and apply the proper status and tests
function loadPatients() {
    var patients = JSON.parse(localStorage.getItem('patients')) || [];
    patients.forEach(function(patient) {
        const testCount = patient.tests ? patient.tests.length : 0;

   // Truncate details if longer than 25 characters
   var truncatedDetails = patient.details.length > 25 ? patient.details.substring(0, 25) + '...' : patient.details;

        patientTable.row.add([
            '<input type="checkbox" name="checkbox"  class="rowCheckbox">',
            patient.id,
            patient.name,
            patient.age,
            patient.gender,
            truncatedDetails,
            '<span class="action-icons">' +
            '<a href="#" class="view-icon" data-id="' + patient.id + '" title="View"><span class="material-symbols-sharp table-icons">visibility</span></a>' +
            '<a href="#" class="edit-icon" data-id="' + patient.id + '" title="Edit"><span class="material-symbols-sharp table-icons">edit</span></a>' +
            '<a href="#" class="delete-icon" data-id="' + patient.id + '" title="Delete"><span class="material-symbols-sharp table-icons">delete</span></a>' +
            '<a href="#" class="assign-tests" data-id="' + patient.id + '" title="Assign Tests"><span class="material-symbols-sharp table-icons">assignment</span></a>' +
            '</span>',
            '<input type="checkbox" name="testcheckbox" class="testCheckbox" ' + (testCount > 0 ? 'checked' : '') + '> ' +
            '<a href="#" class="assign-tests test-count" data-id="' + patient.id + '">' + testCount + ' Tests</a>',
            '<label class="active tablelabel"><input type="radio" class="activecolor" name="status' + patient.id + '" value="active" ' + (patient.status === 'Active' ? 'checked' : '') + '> Active</label>' +
            '<label class="tablelabel"><input type="radio" class="inactivecolor"  name="status' + patient.id + '" value="inactive" ' + (patient.status === 'Inactive' ? 'checked' : '') + '> Inactive</label>'
        ]).draw(false);
    });
    }
    

 
// ==============================================================================================================================//
// ======================================================On Page Loaf Effect=====================================================// 
// ==============================================================================================================================//


   // Apply fade-in effect on page load
   window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Apply fade-out effect before page reload or navigation
window.addEventListener('beforeunload', (event) => {
    document.body.classList.add('fade-out');
});


 
// ==============================================================================================================================//
// ======================================================Save Table Page Index===================================================// 
// ==============================================================================================================================//



// Save the current page index before the page loads
window.onbeforeunload = function() {
    localStorage.setItem('dataTablePage', patientTable.page());
};

// Restore the page index after the page loads
$(document).ready(function() {
    const savedPage = localStorage.getItem('dataTablePage');
    if (savedPage !== null) {
        patientTable.page(parseInt(savedPage)).draw(false); // Restore the saved page index
        localStorage.removeItem('dataTablePage'); // Clear the stored page after use
    }
});
