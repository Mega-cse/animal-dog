document.addEventListener('DOMContentLoaded', () => {
    const breedGrid = document.getElementById('breedGrid');
  
    // Fetch data from the API
    fetch('https://dog.ceo/api/breeds/list/all')
      .then(response => {
        // Check if the response is successful (status code 200)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Parse the JSON response
        return response.json();
      })
      .then(data => {
        // Extract the breeds object from the data
        const breeds = Object.keys(data.message);
  
        // Fetch images for each breed
        const fetchImagePromises = breeds.map(breed => {
          return fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to fetch image for ${breed}`);
              }
              return response.json();
            })
            .then(data => {
              return { breed, image: data.message };
            });
        });
  
        // Wait for all fetches to complete
        return Promise.all(fetchImagePromises);
      })
      .then(breedImages => {
        // Display breed images in the UI
        breedImages.forEach(({ breed, image }) => {
          const breedCard = document.createElement('div');
          breedCard.classList.add('breed-card');
  
          const imgElement = document.createElement('img');
          imgElement.classList.add('breed-image');
          imgElement.src = image;
          imgElement.alt = breed;
  
          const breedName = document.createElement('p');
          breedName.classList.add('breed-name');
          breedName.textContent = breed;
  
          breedCard.appendChild(imgElement);
          breedCard.appendChild(breedName);
          
          breedGrid.appendChild(breedCard);
        });
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        breedGrid.innerHTML = '<p>Failed to fetch breed images.</p>';
      });
  });
  