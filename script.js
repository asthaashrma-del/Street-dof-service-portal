document.addEventListener("DOMContentLoaded", () => {
    const loginFormEl = document.getElementById("loginForm");
    const registerFormEl = document.getElementById("registerForm");
    const ctaButton = document.querySelector(".cta-button"); 
      const userName = localStorage.getItem("userName");
    if (userName) {
        document.getElementById("userName").textContent = userName;
    }

    document.addEventListener("DOMContentLoaded", () => {
    // Your existing code here...

    // NEW: Load locations from backend and populate dropdown
    async function loadLocations() {
        try {
            const res = await fetch('http://localhost:5000/api/locations');
            const locations = await res.json();

            const select = document.getElementById('locationSelect');
            if (!select) return; // If select not on this page, skip

            // Clear existing options except "All Locations"
            select.innerHTML = '<option value="">All Locations</option>';

            // Add options dynamically from backend
            locations.forEach(loc => {
                const option = document.createElement('option');
                option.value = loc;
                option.textContent = loc;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading locations:', error);
        }
    }

    loadLocations();

    // Rest of your existing code...

     // New code to dynamically populate location dropdown
  const locationSelect = document.getElementById("locationSelect");

  if (locationSelect) { // Check if dropdown exists on this page
    fetch("http://localhost:5000/api/dogs")
      .then(response => response.json())
      .then(dogs => {
        const locations = [...new Set(dogs.map(dog => dog.location))];
        locationSelect.innerHTML = '<option value="">All Locations</option>';
        locations.forEach(location => {
          const option = document.createElement("option");
          option.value = location;
          option.textContent = location;
          locationSelect.appendChild(option);
        });
      })
      .catch(error => console.error("Error fetching dogs or locations:", error));
  }

});

    // ✅ Background Image Slider
    const images = document.querySelectorAll(".slider img");
    let currentIndex = 0;

    function changeImage() {
        images[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add("active");
    }

    setInterval(changeImage, 3000);

    if (ctaButton) {
        ctaButton.addEventListener("click", () => {
            window.location.href = "register.html"; // ✅ Redirect to Registration Page
        });
    }
    // ✅ Registration Form Submission
    if (registerFormEl) {
        registerFormEl.addEventListener("submit", async (event) => {
            event.preventDefault(); // ✅ Prevents page refresh

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!name || !email || !password) {
                alert("❌ Please fill in all fields!");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await response.json();

                if (response.ok) {  // ✅ Fix: Check response status
                    alert("✅ Registration Successful!");
                    registerFormEl.reset();
                    window.location.href = "login.html"; // ✅ Redirect to login page
                } else {
                    alert(`❌ ${data.message}`);
                }
            } catch (error) {
                alert("❌ Registration failed. Please try again.");
            }
        });
    }

    // ✅ Login Form Submission
    if (loginFormEl) {
        loginFormEl.addEventListener("submit", async (event) => {
            event.preventDefault(); // ✅ Stops page reload

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            if (!email || !password) {
                alert("❌ Please enter both email and password.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {  // ✅ Fix: Check response status
                    alert("✅ Login Successful!");
                    window.location.href = "home.html"; // ✅ Redirect to home page
                } else {
                    alert(`❌ ${data.message}`);
                }
            } catch (error) {
                alert("❌ Login failed. Please check your credentials.");
            }
        });
    }
});
