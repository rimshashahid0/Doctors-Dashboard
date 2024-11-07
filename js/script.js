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




// ==============================================================================================================================//
// ========================================================Add Patient Modal=====================================================// 
// ==============================================================================================================================//


// Get the modal
const modal = document.getElementById("addPatientModal");

// Get the button that opens the modal
const btn = document.getElementById("openModalBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("addpatientclose")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

  // Save new patient to localStorage
  function savePatient(patient) {
    var patients = JSON.parse(localStorage.getItem('patients')) || [];
    patients.push(patient);
    localStorage.setItem('patients', JSON.stringify(patients));
  }



// ==============================================================================================================================//
// =======================================================View Patient Modal=====================================================// 
// ==============================================================================================================================//



// Function to open the view patient modal
function openViewPatientModal(patient) {
    // Populate modal with patient details
    document.getElementById('viewpatientName').innerText = patient.name || 'Unknown';
    document.getElementById('viewpatientAge').innerText = patient.age || 'Unknown';
    document.getElementById('viewpatientGender').innerText = patient.gender || 'Unknown';
    document.getElementById('viewpatientDetails').innerText = patient.details || 'Unknown';

    // Show the modal
    $('#viewPatientModal').show();
}

// Close modal when clicking on the close button
$('.viewclose').click(function() {
    $('#viewPatientModal').hide();
});

// Close modal when clicking outside the modal content
$(window).on('click', function(event) {
    var modal = $('#viewPatientModal');
    if (event.target === modal[0]) {  // Check if the click is outside the modal content
        modal.hide(); // Hide the modal
    }
});

// Example usage: Add an event listener to your patient table/view button
$('#patientTableBody').on('click', '.view-icon', function() {
    const patientId = $(this).data('id'); // Get the patient ID
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const patient = patients.find(p => p.id === patientId);

    if (patient) {
        openViewPatientModal(patient); // Open the modal with patient details
    }
});


// ==============================================================================================================================//
// ========================================================Edit Patient Modal=====================================================// 
// ==============================================================================================================================//



// Handle edit icon click
$('#patientTableBody').on('click', '.edit-icon', function() {
    editPatientId = $(this).data('id'); // Get the patient ID
    var patient = JSON.parse(localStorage.getItem('patients')).find(p => p.id === editPatientId); // Find the patient data

    // Set the values in the edit modal
    $('#editPatientName').val(patient.name);
    $('#editPatientAge').val(patient.age);
    $('#editPatientGender').val(patient.gender);
    $('#editPatientDetails').val(patient.details);

    // Set the correct status in the modal
    $('#patientStatus').val(patient.status);

    $('#editModal').show(); // Show the edit modal
});

// Update patient details on form submission
$('#updatePatientForm').on('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    var updatedPatient = {
        id: editPatientId,
        name: $('#editPatientName').val(),
        age: $('#editPatientAge').val(),
        gender: $('#editPatientGender').val(),
        details: $('#editPatientDetails').val(),
        status: $('#patientStatus').val(), // Get the updated status from the form
        tests: JSON.parse(localStorage.getItem('patients')).find(p => p.id === editPatientId).tests // Preserve the assigned tests
    };

    updatePatient(updatedPatient); // Update patient in localStorage
    
    $('#editModal').hide(); // Hide the modal
    refreshTable(); // Refresh the table
    
});

// Update patient function
function updatePatient(updatedPatient) {
    var patients = JSON.parse(localStorage.getItem('patients')) || [];
    patients = patients.map(function(patient) {
        if (patient.id === updatedPatient.id) {
            return updatedPatient; // Return updated patient
        }
        return patient; // Return unchanged patient
    });
    localStorage.setItem('patients', JSON.stringify(patients));
    
    window.location.href = 'doctorspage.html';  // Redirect after saving
}

// Close the modal when the close button is clicked
$('.editclose').on('click', function() {
    $('#editModal').hide();
});

// Close the modal when clicking outside of the modal
$(window).on('click', function(event) {
    if ($(event.target).is('#editModal')) {
        $('#editModal').hide();
    }
});


// ==============================================================================================================================//
// ========================================================Delete Patient Modal=====================================================// 
// ==============================================================================================================================//



$(document).ready(function() {
    var selectedPatientIds = [];
    var deletePatientId = null; // To store the patient ID when only one entry is being deleted

    // Handle delete icon click
    $('#patientTableBody').on('click', '.delete-icon', function() {
        selectedPatientIds = [];

        // Get the IDs of all selected checkboxes
        $('.rowCheckbox:checked').each(function() {
            var patientId = $(this).closest('tr').find('.edit-icon').data('id');
            selectedPatientIds.push(patientId);
        });

        if (selectedPatientIds.length === 0) {
            // If no checkboxes are selected, delete only the row where the delete icon is clicked
            deletePatientId = $(this).data('id'); // Get the patient ID of the row
            selectedPatientIds.push(deletePatientId); // Add this single ID to the array for deletion
        }

        // Show confirmation modal with the number of selected entries
        $('#deleteCount').text(selectedPatientIds.length); // Update the modal with the count
        $('#confirmModal').show(); // Show the confirmation modal
    });

    // Confirm delete
    $('#confirmDelete').click(function() {
        deletePatients(selectedPatientIds); // Delete the selected patients
        $('#confirmModal').hide(); // Hide the modal
        refreshTable(); // Refresh the table after deletion
    });

    // Cancel delete
    $('#cancelDelete').click(function() {
        $('#confirmModal').hide(); // Hide the modal
    });

    // Close modal if clicked outside of it
    $(window).on('click', function(event) {
        var modal = $('#confirmModal');
        if (event.target === modal[0]) {  // Check if the click is outside the modal content
            modal.hide(); // Hide the modal
        }
    });

    // Delete multiple patients by IDs
    function deletePatients(ids) {
        var patients = JSON.parse(localStorage.getItem('patients')) || [];

        // Filter out patients that have IDs in the selectedPatientIds array
        patients = patients.filter(function(patient) {
            return !ids.includes(patient.id);
        });

        localStorage.setItem('patients', JSON.stringify(patients)); // Update localStorage
    }

    // Refresh the DataTable with updated patient numbers
    function refreshTable() {
        patientTable.clear().draw(); // Clear the table
        var patients = JSON.parse(localStorage.getItem('patients')) || [];

        // Reassign patient numbers and save them back to localStorage
        patients.forEach(function(patient, index) {
            patient.id = index + 1; // Reassign patient numbers starting from 1
        });

        localStorage.setItem('patients', JSON.stringify(patients));
        loadPatients(); // Reload patients from localStorage

        truncateDetailsText(); // Truncate long text in the details column after reloading
    }
});



// ==============================================================================================================================//
// ======================================================Assign Test Patient Modal===============================================// 
// ==============================================================================================================================//


document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    
    console.log("Patient ID: ", patientId);  // Debugging to check if the correct patient ID is being used

    loadPatientInfo(patientId); // Load patient info
    loadAssignedTests(patientId); // Load previously assigned tests

});

// Function to open the assign tests modal with patient details
function openAssignTestsModal(patientId) {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const patient = patients.find(p => p.id == patientId);

    if (patient) {
        // Populate modal with patient details
        document.getElementById('testpatientName').innerText = patient.name || 'Unknown';
        document.getElementById('testpatientAge').innerText = patient.age || 'Unknown';
        document.getElementById('testpatientGender').innerText = patient.gender || 'Unknown';
        document.getElementById('testpatientDetails').innerText = patient.details || 'Unknown';

        // Pre-check previously assigned tests
        loadAssignedTests(patientId);

        // Show the modal
        $('#testModal').show();

        // Attach the submit listener after the modal is shown
        document.getElementById('assignTests').addEventListener('submit', function(e) {
            e.preventDefault();
            const selectedTests = Array.from(document.querySelectorAll('.test-checkbox:checked')).map(checkbox => checkbox.value);
            if (selectedTests.length === 0) {
                alert('No test is selected. Please select at least one test.');
                return;
            }
            saveAssignedTests(patientId, selectedTests);
        });
    } else {
        console.log("Patient not found with ID:", patientId);
    }
}

// Function to load patient info
function loadPatientInfo(patientId) {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const patient = patients.find(p => p.id == patientId);

    if (patient) {
        document.getElementById('testpatientName').innerText = patient.name || 'Unknown';
        document.getElementById('testpatientAge').innerText = patient.age || 'Unknown';
        document.getElementById('testpatientGender').innerText = patient.gender || 'Unknown';
        document.getElementById('testpatientDetails').innerText = patient.details || 'Unknown';
    } else {
        console.log("No patient found with ID: ", patientId);  // Debugging: Check if the correct patient is found
    }
}

// Function to load assigned tests
function loadAssignedTests(patientId) {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const patient = patients.find(p => p.id == patientId);

    if (patient && patient.tests) {
        const assignedTests = patient.tests;
        console.log("Assigned tests for patient:", assignedTests);  // Debugging: Check assigned tests
        
        assignedTests.forEach(test => {
            const checkbox = document.querySelector(`.test-checkbox[value="${test}"]`);
            if (checkbox) {
                checkbox.checked = true;  // Mark the checkbox as checked if the test is assigned
                console.log(`Test '${test}' checked`);  // Debugging: Confirm which tests are being checked
            } else {
                console.log(`Checkbox not found for test: ${test}`);  // Debugging: Check if the test value matches
            }
        });
    } else {
        console.log("No assigned tests found for patient with ID: ", patientId);  // Debugging: Check if there are assigned tests
    }
}

// Function to save assigned tests to localStorage
function saveAssignedTests(patientId, tests) {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const updatedPatients = patients.map(patient => {
        if (patient.id == patientId) {
            patient.tests = tests;  // Update the patient's assigned tests
            console.log(`Saving tests for patient ${patientId}:`, tests);  // Debugging: Confirm what's being saved
        }
        return patient;
    });

    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    console.log("Updated patients saved to localStorage.");  // Debugging: Confirm the data was saved

    window.location.href = 'doctorspage.html';  // Redirect after saving
}

// Event listener to trigger opening modal with patient details on clicking "assign tests" button
$('#patientTableBody').on('click', '.assign-tests', function() {
    const patientId = $(this).data('id'); // Get patient ID
    openAssignTestsModal(patientId); // Open modal with patient details
});

// Close modal when clicking on the close button (span), outside the modal, or the cancel button
function closeModal() {
    $('#testModal').hide();
}

// Close modal when clicking on the span close button
document.getElementById('closeModal').addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
window.addEventListener('click', function(event) {
    if (event.target.id === 'testModal') {
        closeModal();
    }
});

// Close modal when clicking the cancel button
document.getElementById('cancelButton').addEventListener('click', closeModal);




})
