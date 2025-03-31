//General Functons

//gets year
function getCurrentYear() {
    return new Date().getFullYear();
}

// Email validation form
function validateEmailForm() {
    let isValid = true;

    let nameField = document.getElementById("name").value.trim();
    let email = document.getElementById("email");
    let mobile = document.getElementById("mobile").value.trim();
    let zip = document.getElementById("zip").value.trim();
    let smsOptIn = document.getElementById("sms_opt_in").checked;
    
    let Error = document.getElementById("formError");

    // Clear any previous error messages
    resetErrors([Error]);

    // Validate name (required, min length 2)
    if (!nameField || nameField.length < 2) {
        Error.textContent = "⚠️ Name must be at least 2 characters long.";
        isValid = false;
    }
    // If email is invalid, show warning and mark as invalid
    else if (!email.checkValidity()) {
        Error.textContent = "⚠️ Please enter a valid email address.";
        isValid = false;
    }

    // Validate mobile if filled in
    else if (smsOptIn && !/^\d{10}$/.test(mobile)) {
        Error.textContent = "⚠️ Mobile phone must be exactly 10 digits and contain numbers only.";
        isValid = false;
    }

    // Validate zip code if filled in
    else if (zip && !/^\d{5}$/.test(zip)) {
        Error.textContent = "⚠️ Zip code must be exactly 5 digits and contain numbers only.";
        isValid = false;
    }

    return isValid;
}

// Resets errors for given elements
function resetErrors(elements) {
    elements.forEach((el) => {
        el.textContent = "";
    });
}

//activates mobile field only if sns field is checked
document.getElementById("sms_opt_in").addEventListener("change", function () {
    const mobileWrapper = document.getElementById("mobile-wrapper");
    const mobileInput = document.getElementById("mobile");

    if (this.checked) {
        mobileWrapper.style.display = "flex";
        mobileInput.required = true;
    } 
    else {
        mobileWrapper.style.display = "none";
        mobileInput.required = false;
        // clear when hiding
        mobileInput.value = ""; 
    }
});

//event listener that applies to all pages
document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-links a");
    const menuIcon = document.getElementById("menu-icon");
    const navLinksContainer = document.querySelector(".nav-links");

    //current page effect
    navLinks.forEach(link => {
    const linkPath = link.getAttribute("href").split("/").pop();
    if (linkPath === currentPath) {
        link.classList.add("active");
    }
    });

    // Toggle mobile nav menu on menu icon click for mobile
    if (menuIcon && navLinksContainer) {
    menuIcon.addEventListener("click", function () {
        navLinksContainer.classList.toggle("active");
    });
    }

    // Close the mobile nav when a link is clicked
    navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navLinksContainer.classList.remove("active");
    });
    });

    // Update the year in the footer or wherever needed
    document.getElementById("year").textContent = new Date().getFullYear();
});

//index.html eventlistener
if (window.location.href.includes("index.html")) {
    document.addEventListener("DOMContentLoaded", () => {

        function fetchWeatherData() {
            //weather API
            const weatherUrl = "https://api.weatherapi.com/v1/current.json?key=89dc8101bd584aea9e4225134251803&q=Pittsburgh";
            const proxyUrl = "https://api.codetabs.com/v1/proxy/?quest=" + encodeURIComponent(weatherUrl);
    
            // Fetch and display the weather data
            fetch(proxyUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch weather data");
                    }
                    return response.json();
                })
                .then(data => {
                    if (!data.current) {
                        throw new Error("Invalid weather data format");
                    }
                    // Display the temperature and weather condition
                    document.getElementById("weather-data").innerText = `${data.current.temp_f}°F, ${data.current.condition.text}`;
                })
                .catch(error => console.error("Error fetching weather data:", error));
        }
    
        fetchWeatherData();
    
        //carousel
        const track = document.querySelector(".carousel-track");
        const prevButton = document.querySelector(".carousel-btn.prev");
        const nextButton = document.querySelector(".carousel-btn.next");
    
        let images = Array.from(track.children); // Get all carousel images
        let index = 2; // Start at the third image after adding clones
        let imageWidth;
        let autoScrollInterval;
        let buttonLocked = false; // Prevent rapid clicking
    
        // Clone last two images to the beginning and first two to the end
        // Creates a smooth infinite carousel loop
        function cloneImages() {
            const clonesBefore = [
                images[images.length - 2].cloneNode(true),
                images[images.length - 1].cloneNode(true)
            ];
            const clonesAfter = [
                images[0].cloneNode(true),
                images[1].cloneNode(true)
            ];
            
            // Prepend and append clones
            clonesBefore.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));
            clonesAfter.forEach(clone => track.appendChild(clone));
            
            // Update the images list
            images = Array.from(track.children);
        }
    
        // Move carousel to the current image index
        // If `instant`  true, jump with no animation ( for loop reset)
        function setTrackPosition(instant = false) {
            imageWidth = images[index].clientWidth;
            if (instant) {
                track.style.transition = "none";
            } else {
                track.style.transition = "transform 0.5s ease-in-out";
            }
            track.style.transform = `translateX(-${index * imageWidth}px)`;
        }
    
        //move right
        function handleNext() {
            index++;
            setTrackPosition();
        
            // If reached end, jump back to the real start (after clone)
            track.addEventListener("transitionend", () => {
                if (index >= images.length - 2) {
                index = 2;
                setTrackPosition(true);
                }
            }, { once: true });
        }
        
        //move left
        function handlePrev() {
            index--;
            setTrackPosition();
            
            // If reached start, jump to the real end (before clone)
            track.addEventListener("transitionend", () => {
                if (index <= 1) {
                index = images.length - 3;
                setTrackPosition(true);
                }
            }, { once: true });
            }
        
        // Start auto-scrolling the carousel every 4 seconds    
        function startAutoScroll() {
            autoScrollInterval = setInterval(handleNext, 4000);
        }
        
         
        // Restart auto-scroll timer when user interacts
        function resetAutoScroll() {
            clearInterval(autoScrollInterval);
            startAutoScroll();
        }
        
        // Initialize carousel: clone images, set listeners, and start scrolling
        function initCarousel() {
            cloneImages();
            index = 2;
        
            // Reset position when window is resized
            window.addEventListener("resize", () => setTrackPosition(true));

            // Wait a short time to ensure layout is ready before jumping
            setTimeout(() => setTrackPosition(true), 50);
            
            //set next and prev button cooldown
            nextButton.addEventListener("click", () => {
                if (buttonLocked) return;
                buttonLocked = true;
        
                handleNext();
                resetAutoScroll();
        
                setTimeout(() => {
                buttonLocked = false;
                }, 800);
            });
        
            prevButton.addEventListener("click", () => {
                if (buttonLocked) return;
                buttonLocked = true;
        
                handlePrev();
                resetAutoScroll();
        
                setTimeout(() => {
                buttonLocked = false;
                }, 800);
            });
        
        startAutoScroll(); // Begin auto-scrolling again
        }
        
        // Initialize the carousel once the window finishes loading
        window.addEventListener("load", initCarousel);
    });
}



//History Page

//accessibility for accordian his (changed to buttons)
document.querySelectorAll('.accordionhis-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const content = document.getElementById(button.getAttribute('aria-controls'));
  
      // Toggle clicked panel
      button.setAttribute('aria-expanded', !expanded);
      content.hidden = expanded;
    });
});

/* random fact */
// Displays a random historical fact about the Duquesne Incline
function showRandomFact() {
    const facts = [
        "Opened to the public on May 20, 1877.",
        "It cost $47,000 to build.",
        "The track is 794 feet long.",
        "The elevation is 400 feet.",
        "The incline has a 30.5-degree grade.",
        "It moves at 6 miles per hour.",
        "Each car holds up to 18 passengers.",
        "It was originally used for transporting coal workers.",
        "Designed by Samuel Diescher, a famous incline engineer."
    ];

    // Pick a random fact from the array
    const randomIndex = Math.floor(Math.random() * facts.length);
    const factDisplay = document.getElementById("random-fact");
    factDisplay.textContent = facts[randomIndex];
}

/* timeline */
// Calculates and positions timeline points and range bars
function updateTimelinePositions() {
    const points = document.querySelectorAll(".timeline-labeled-point");
    const bars = document.querySelectorAll(".timeline-range-bar");
    const popup = document.getElementById("timeline-popup");
    const timelineLine = document.querySelector(".timeline-line");
    const minYear = 1850;
    const maxYear = getCurrentYear();

    // Clear old bars
    bars.forEach(bar => bar.remove());

    points.forEach((wrapper) => {
        const point = wrapper.querySelector(".timeline-point");
        const yearStr = point.getAttribute("data-year");

        let year, startYear, endYear;

        // Handle ranges like "1877–1900" or "1964–Now"
        if (yearStr.includes("–")) {
            const [start, end] = yearStr.split("–");
            startYear = start === "1964"? 1963 : parseInt(start);
            endYear = end === "Now" ? maxYear : parseInt(end);
            year = (startYear + endYear) / 2;

            // Calculate position as percentage of the total timeline
            const startPercent = ((startYear - minYear) / (maxYear - minYear)) * 100 + 3;
            const endPercent = ((endYear - minYear) / (maxYear - minYear)) * 100 - 3;

            // Create a horizontal bar for the range
            const bar = document.createElement("div");
            bar.classList.add("timeline-range-bar");
            bar.style.left = `${startPercent}%`;
            bar.style.right = `${100-endPercent}%`;

            timelineLine.appendChild(bar);
        } else {
            // For single-year events
            year = parseInt(yearStr);
        }

        // Position the point on the timeline
        const percent = ((year - minYear) / (maxYear - minYear)) * 100;
        wrapper.style.left = `${percent}%`;
        wrapper.style.transform = "translate(-50%, -50%)";

        // Show popup with description when point is clicked
        point.addEventListener("click", (e) => {
            const popupYear = document.getElementById("popup-year");
            const popupDescription = document.getElementById("popup-description");

            popupYear.textContent = yearStr;
            popupDescription.textContent = point.getAttribute("data-description");

            // Calculate popup position based on point location
            const pointRect = point.getBoundingClientRect();
            const containerRect = timelineLine.getBoundingClientRect();
            const pointCenterX = pointRect.left + pointRect.width / 2;
            const offsetX = pointCenterX - containerRect.left;

            popup.style.left = `${offsetX}px`;

            // Adjust popup alignment if near screen edges
            const screenWidth = window.innerWidth;
            let xOffset = "-50%";
            if (pointCenterX < 150) {
                xOffset = "0";
            } else if (pointCenterX > (screenWidth - 150)) {
                xOffset = "-90%";
            }

            popup.style.transform = `translate(${xOffset}, 20px)`;
            popup.classList.remove("hidden");
        });
    });

    // Hide popup by default
    popup.classList.add("hidden");
}

//History Page initialization
if (window.location.href.includes("history.html")) {
    document.addEventListener("DOMContentLoaded", () => {
        // Position timeline elements on load
        updateTimelinePositions();

        // Recalculate positions if window is resized
        window.addEventListener("resize", updateTimelinePositions);

        /* history accordion */
        document.querySelectorAll(".accordion-toggle").forEach((toggle) => {
            toggle.addEventListener("click", () => {
                const content = toggle.nextElementSibling;

                // Toggle visibility of accordion content
                content.style.display = content.style.display === "block" ? "none" : "block";
            });
        });

        // Close Timeline Popup on Outside Click
        document.addEventListener("click", (e) => {
            const popup = document.getElementById("timeline-popup");

            // Hide popup if user clicks outside timeline points or the popup itself
            if (!e.target.classList.contains("timeline-point") && !popup.contains(e.target)) {
                popup.classList.add("hidden");
            }
        });

    });
}




/*visit us */

//locations array
const locations = [
    {
      address: "1197 West Carson St, Pittsburgh, PA 15219",
      title: "Parking - Lower Station",
      content: "Main parking area near the Lower Station of the Duquesne Incline."
    },
    {
      address: "1220 Grandview Ave, Pittsburgh, PA 15211",
      title: "Upper Station",
      content: "Upper Station with panoramic views of Pittsburgh."
    },
    {
      address: "Station Square, Pittsburgh, PA",
      title: "Station Square",
      content: "Shops, dining, and attractions near the Lower Station."
    },
    {
      address: "Steel Mill Saloon, Pittsburgh, PA",
      title: "Steel Mill Saloon",
      content: "Dining on Grandview Avenue. 412-586-4926"
    },
    {
      address: "Coal Hill Steakhouse, Pittsburgh, PA",
      title: "Coal Hill Steakhouse (Grandview Saloon)",
      content: "Steakhouse dining with a city view. 412-431-1400"
    },
    {
      address: "LeMont Restaurant, Pittsburgh, PA",
      title: "LeMont Restaurant",
      content: "Fine dining on Grandview Ave. 412-431-3100"
    },
    {
      address: "Monterey Bay Fish Grotto, Pittsburgh, PA",
      title: "Monterey Bay Fish Grotto",
      content: "Seafood restaurant near the Upper Station. 412-381-1919"
    },
    {
      address: "Rivers Casino Pittsburgh, Pittsburgh, PA",
      title: "Rivers Casino",
      content: "Casino across the river from the Lower Station. 412-231-7777"
    },
    {
      address: "Heinz Field, Pittsburgh, PA",
      title: "Heinz Field",
      content: "Home of the Steelers and Pitt Panthers. 412-323-1200"
    },
    {
      address: "PNC Park, Pittsburgh, PA",
      title: "PNC Park",
      content: "Home of the Pittsburgh Pirates. 412-321-BUCS"
    },
    {
      address: "Carnegie Science Center, Pittsburgh, PA",
      title: "Carnegie Science Center",
      content: "Hands-on exhibits and science fun. 412-237-3336"
    },
    {
      address: "Market Square, Pittsburgh, PA",
      title: "Market Square",
      content: "Shops and dining in downtown Pittsburgh."
    },
    {
      address: "Fort Pitt Museum, Pittsburgh, PA",
      title: "Fort Pitt Museum",
      content: "Historic museum and blockhouse. 412-454-6000"
    },
    {
      address: "1000 Fort Duquesne Blvd, Pittsburgh, PA",
      title: "David L. Lawrence Convention Center",
      content: "Convention and event space. 412-565-6000"
    },
    {
      address: "803 Liberty Ave, Pittsburgh, PA",
      title: "Benedum Center",
      content: "Performing arts theater. 412-456-6666"
    },
    {
      address: "101 6th St, Pittsburgh, PA",
      title: "Byham Theater",
      content: "Cultural and music performances. 412-456-6666"
    },
    {
      address: "1001 5th Ave, Pittsburgh, PA",
      title: "PPG Paints Arena",
      content: "Home of the Penguins. 412-642-1800"
    },
    {
      address: "600 Penn Ave, Pittsburgh, PA",
      title: "Heinz Hall",
      content: "Home of the Pittsburgh Symphony. 412-392-4900"
    },
    {
      address: "1212 Smallman St, Pittsburgh, PA",
      title: "Heinz History Center",
      content: "Western PA's largest history museum. 412-454-6000"
    },
    {
        address: "1220 Grandview Ave, Pittsburgh, PA 15211",
        title: "Wheelchair Accessibility",
        content: "Accessible entrance located at the Upper Station."
    }
  ];

/**
 * Returns a Google Maps marker icon URL based on the location type.
 * This uses simple keyword checks to color-code different categories.
 */
function getMarkerIcon(loc) {
    const title = loc.title.toLowerCase();
  
    if (title.includes("parking") || title.includes("upper station")) {
      return "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"; //Duequesne related
    } else if (
      title.includes("restaurant") ||
      title.includes("saloon") ||
      title.includes("grotto") ||
      title.includes("steakhouse")
    ) {
      return "https://maps.google.com/mapfiles/ms/icons/red-dot.png"; //Food
    } else if (
      title.includes("museum") ||
      title.includes("history") ||
      title.includes("science") ||
      title.includes("center") ||
      title.includes("hall")
    ) {
      return "https://maps.google.com/mapfiles/ms/icons/purple-dot.png"; //muesuems
    } else if (
      title.includes("field") ||
      title.includes("arena") ||
      title.includes("park")
    ) {
      return "https://maps.google.com/mapfiles/ms/icons/green-dot.png"; //stadiums
    } else {
      return "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"; //others
    }
}
  

/**
 * Initializes the Google Map and places all location markers on it.
 * Highlights the parking location by centering the map and auto-opening its info window.
 * GoogleMaps API
 */
function initMap() {
    // Create and center the map around Duquesne
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: { lat: 40.443, lng: -80.018 }
    });

    const geocoder = new google.maps.Geocoder();

    // Find the location labeled as Parking to center on
    const parkingLocation = locations.find(loc =>
      loc.title.toLowerCase().includes("parking")
    );
  
    // Loop through all locations and place markers
    locations.forEach(loc => {
      geocoder.geocode({ address: loc.address }, (results, status) => {
        if (status === "OK" && results[0]) {
          // Create a marker for each location
          const marker = new google.maps.Marker({
            map,
            position: results[0].geometry.location,
            title: loc.title,
            icon: getMarkerIcon(loc)
          });

          // Create an info window for when marker is clicked
          const infoWindow = new google.maps.InfoWindow({
            content: 
            `
              <div style="font-family: Roboto, sans-serif; max-width: 300px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-weight: bold; font-size: 16px; color: #1a237e;">${loc.title}</span>
                </div>
                <p style="margin: 8px 0 0; font-size: 14px; color: #333;">${loc.content}</p>
              </div>
            `
          });
          // Show info window on marker click
          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        
          // If this is the parking location, center map on it and open info
          if (loc === parkingLocation) {
            map.setCenter(results[0].geometry.location);
            infoWindow.open(map, marker);
          }
        } else {
          console.error(`Geocode failed for ${loc.title}: ${status}`);
        }
      });
    });
}

// Make the initMap function accessible globally (required by Google Maps API)
window.initMap = initMap;

//Event listener for visit page
if (window.location.href.includes("visit.html")) {
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".accordion-toggle").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const content = toggle.nextElementSibling;
            
            // Toggle display
            if (content.style.display === "block") {
            content.style.display = "none";
            } else {
            content.style.display = "block";
            }
        });
        });
    });
}

/* Gift Shop */

// Track total number of items in the cart
let cartCount = 0;

// Track total price of all items in the cart
let totalPrice = 0;

// DOM elements to display cart summary and total price
const cartSummary = document.getElementById("cart-summary");
const cartTotal = document.getElementById("cart-total");

// Loop through all "Add to Cart" buttons and attach a click listener
document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      cartCount++;
  
      // Get product price from the same row
      const row = button.closest("tr");
      const priceText = row.querySelector("td:nth-child(3)").textContent;
      const price = parseFloat(priceText.replace("$", ""));
      totalPrice += price;
  
      // Update cart summary
      cartSummary.textContent = `🛒 You have ${cartCount} item${cartCount !== 1 ? "s" : ""} in your cart.`;
      cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
  
      // Update count for this product
      const countSpan = row.querySelector(".cart-count span");
      const currentCount = parseInt(countSpan.textContent);
      countSpan.textContent = currentCount + 1;
    });
});

// Loop through all "Remove from Cart" buttons and attach a click listener
document.querySelectorAll(".remove-from-cart").forEach((button) => {
    button.addEventListener("click", () => {
        const row = button.closest("tr");

        // Get current product count
        const countSpan = row.querySelector(".cart-count span");
        let currentCount = parseInt(countSpan.textContent);

        if (currentCount > 0) {
            currentCount--;
            countSpan.textContent = currentCount;

            // Update global cart count and price
            cartCount--;

            const priceText = row.querySelector("td:nth-child(3)").textContent;
            const price = parseFloat(priceText.replace("$", ""));
            totalPrice -= price;

            // Update cart summary
            if (cartCount > 0) {
                cartSummary.textContent = `🛒 You have ${cartCount} item${cartCount !== 1 ? "s" : ""} in your cart.`;
                cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
            } else {
                cartSummary.textContent = `🛒 Your cart is empty.`;
                cartTotal.textContent = "";
            }
        }
    });
});
