document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("GET_PIC");
  const email = document.getElementById("email");
  const placeholderImage = document.getElementById("picsum_img");
  const submitButton = document.getElementById("submit_btn");
  const nextImageButton = document.getElementById("change_img");

  const submittedImages = [];

  function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    validateInputs();
  });

  function validateInputs() {
    const emailValue = email.value.trim();

    if (emailValue === "") {
      setError(email, "Email is required");
    } else if (!isValidEmail(emailValue)) {
      setError(email, "Provide a valid email address");
    } else if (isImageAlreadySaved(emailValue, placeholderImage.src)) {
      setError(email, "You've already saved this image to this email!");
    } else {
      setSuccess(email);

      saveSubmittedImage();

      updateImageLibrary();
    }
  }

  function isImageAlreadySaved(email, imageUrl) {
    return submittedImages.some(image => image.email === email && image.imageUrl === imageUrl);
  }

  function updateImageLibrary() {
    const galleryContainer = document.getElementById("imageGallery");
    galleryContainer.innerHTML = "";

    // Group images by email
    const imagesByUser = {};

    submittedImages.forEach((imageObj) => {
      if (!imagesByUser[imageObj.email]) {
        imagesByUser[imageObj.email] = [];
      }
      imagesByUser[imageObj.email].push(imageObj.imageUrl);
    });

    // Create a list of image groups for each email
    for (const email in imagesByUser) {
      const imageGroup = imagesByUser[email];
      const groupContainer = document.createElement("div");
      const groupTitle = document.createElement("h3");
      groupTitle.textContent = email;
      groupContainer.appendChild(groupTitle);

      imageGroup.forEach((imageUrl) => {
        const imageElement = document.createElement("img");
        imageElement.src = imageUrl;
        imageElement.alt = "Submitted Image";
        groupContainer.appendChild(imageElement);
      });

      galleryContainer.appendChild(groupContainer);
    }
  }

  function setError(element, message) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error");

    errorDisplay.innerText = message;
    inputControl.classList.add("error");
    inputControl.classList.remove("success");
  }

  function setSuccess(element) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error");

    errorDisplay.innerText = "";
    inputControl.classList.add("success");
    inputControl.classList.remove("error");
  }

  function saveSubmittedImage() {
    const picsumImg = document.getElementById("picsum_img");
    const imageUrl = picsumImg.src;
    const emailValue = email.value.trim();

    submittedImages.push({ imageUrl, email: emailValue });

    updateImageLibrary();
  }

  // Random Picture Functionality
  function updateImage() {
    const seed = Math.floor(Math.random() * 1000);
    const width = 200;
    const height = 300;
    const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;

    placeholderImage.src = imageUrl;
  }

  nextImageButton.addEventListener("click", updateImage);

  const removeAllButton = document.getElementById("remove_all_btn");
  removeAllButton.addEventListener("click", removeAllImages);

  function removeAllImages() {
    submittedImages.length = 0;
    updateImageLibrary();
  }
  
});
