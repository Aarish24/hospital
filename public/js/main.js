// Main JavaScript file for client-side functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Add event listeners for delete buttons
    setupDeleteButtons();

    // Setup form validation
    setupFormValidation();
});

// Setup delete confirmation
function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const confirmDelete = confirm('Are you sure you want to delete this item? This action cannot be undone.');
            
            if (confirmDelete) {
                const deleteUrl = this.getAttribute('data-delete-url');
                
                fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Reload the page or remove the element
                        window.location.reload();
                    } else {
                        return response.json().then(data => {
                            throw new Error(data.message || 'Failed to delete');
                        });
                    }
                })
                .catch(error => {
                    alert('Error: ' + error.message);
                });
            }
        });
    });
}

// Setup form validation
function setupFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

// Function to handle API form submissions
function submitApiForm(formId, apiUrl, method = 'POST', redirectUrl = null) {
    const form = document.getElementById(formId);
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Send API request
        fetch(apiUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'API request failed');
                });
            }
            return response.json();
        })
        .then(data => {
            // Show success message
            alert('Operation completed successfully!');
            
            // Redirect if URL provided
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
    });
}