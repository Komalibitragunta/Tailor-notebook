document.addEventListener("DOMContentLoaded", function () {

    // Example: Form validation for customer details
    const customerForm = document.querySelector('form[action="/customer"]');
    if (customerForm) {
      customerForm.addEventListener('submit', function (e) {
        const name = document.querySelector('input[name="name"]').value;
        const phone = document.querySelector('input[name="phone"]').value;
        const address = document.querySelector('input[name="address"]').value;
  
        if (!name || !phone || !address) {
          alert("Please fill all the fields.");
          e.preventDefault();  // Prevent form submission
        }
      });
    }
  
    // Example: Form validation for gender selection
    const genderForm = document.querySelector('form[action="/gender"]');
    if (genderForm) {
      genderForm.addEventListener('submit', function (e) {
        const genderSelected = document.querySelector('input[name="gender"]:checked');
        
        if (!genderSelected) {
          alert("Please select a gender.");
          e.preventDefault();  // Prevent form submission
        }
      });
    }
  
    // Example: Form validation for payment details
    const paymentForm = document.querySelector('form[action="/payment"]');
    if (paymentForm) {
      paymentForm.addEventListener('submit', function (e) {
        const totalAmount = document.querySelector('input[name="totalAmount"]').value;
        const amountPaid = document.querySelector('input[name="amountPaid"]').value;
        const deliveryDate = document.querySelector('input[name="deliveryDate"]').value;
  
        if (!totalAmount || !amountPaid || !deliveryDate) {
          alert("Please fill in all the payment details.");
          e.preventDefault();  // Prevent form submission
        } else if (parseFloat(amountPaid) > parseFloat(totalAmount)) {
          alert("Amount Paid cannot be more than Total Amount.");
          e.preventDefault();  // Prevent form submission
        }
      });
    }
  
    // Example: Dynamic content or form modification can be added here
    const dressForm = document.querySelector('form[action="/dress"]');
    if (dressForm) {
      const dressSelect = document.querySelector('select[name="dressType"]');
      dressSelect.addEventListener('change', function () {
        // You can dynamically change options based on selected dress type
        console.log(`Selected Dress Type: ${dressSelect.value}`);
      });
    }
  });
  