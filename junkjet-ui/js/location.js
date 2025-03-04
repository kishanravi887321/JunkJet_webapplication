document.addEventListener("DOMContentLoaded", () => {
    const getLocationButton = document.getElementById("get-location")
    const latitudeInput = document.getElementById("latitude")
    const longitudeInput = document.getElementById("longitude")
  
    if (getLocationButton && latitudeInput && longitudeInput) {
      getLocationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
          getLocationButton.disabled = true
          getLocationButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...'
  
          navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
              latitudeInput.value = position.coords.latitude
              longitudeInput.value = position.coords.longitude
  
              getLocationButton.disabled = false
              getLocationButton.innerHTML = '<i class="fas fa-check"></i> Location Updated'
              getLocationButton.classList.add("success")
  
              // Reset button after 3 seconds
              setTimeout(() => {
                getLocationButton.innerHTML = '<i class="fas fa-map-marker-alt"></i> Get Current Location'
                getLocationButton.classList.remove("success")
              }, 3000)
            },
            // Error callback
            (error) => {
              console.error("Error getting location:", error)
  
              getLocationButton.disabled = false
              getLocationButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Location Error'
              getLocationButton.classList.add("error")
  
              // Show error message
              alert("Error getting location: " + getLocationErrorMessage(error))
  
              // Reset button after 3 seconds
              setTimeout(() => {
                getLocationButton.innerHTML = '<i class="fas fa-map-marker-alt"></i> Get Current Location'
                getLocationButton.classList.remove("error")
              }, 3000)
            },
            // Options
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            },
          )
        } else {
          alert("Geolocation is not supported by this browser.")
        }
      })
    }
  
    // Helper function to get error message
    function getLocationErrorMessage(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          return "User denied the request for geolocation."
        case error.POSITION_UNAVAILABLE:
          return "Location information is unavailable."
        case error.TIMEOUT:
          return "The request to get user location timed out."
        case error.UNKNOWN_ERROR:
          return "An unknown error occurred."
        default:
          return "An error occurred while getting location."
      }
    }
  })
  
  