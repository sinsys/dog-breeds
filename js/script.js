'use strict';

// Add a prototype to strings to capitalize the first letter
String.prototype.capFirstLetter = function(){
	return this.charAt(0).toUpperCase() + this.substring(1);
}

// Query multiple dog images randomly
function getDogImages(num){
	// Error handler if nothing entered
	if(num === ""){ num = 1; }
  fetch('https://dog.ceo/api/breeds/image/random/' + num)
  	.then(errorHandler)
    .then(res => res.json())
    .then(dogData => $renderImages(dogData.message))
    .catch(err => console.log(err));
}

// Query all dog breeds currently supported by the API
function findBreeds(){
	fetch('https://dog.ceo/api/breeds/list/all')
		.then(errorHandler)
		.then(res => res.json())
		.then(breedData => $renderBreeds(breedData.message))
		.catch(err => console.log(err));
}

// Query a single dog image from a specific breed
function findBreedImg(breed){
	let breedName = breed.toLowerCase();
	fetch('https://dog.ceo/api/breed/' + breedName + '/images/random')
		.then(errorHandler)
		.then(res => res.json())
		.then(breedImg => $renderImage(breedImg.message))
		.catch(err => $errorHandlerDOM("We cannot find that dog breed. Please try again."));
}

// Render all returned images
function $renderImages(data){
	data.forEach(img => {
		$('.dog-results').append(`
			<img class="dog-result" src="${img}" alt="dog">
		`);
	});
}

// Return a single image
function $renderImage(data){
	$('.dog-results').append(`
		<img class="dog-result single" src="${data}" alt="dog">
	`);	
}

// Render all breeds into a selectable list
function $renderBreeds(data){
	let breedArr = [];
	for(let breed in data){
		breedArr.push(breed.capFirstLetter());
	}
	breedArr.sort().forEach(breed => {
		$('.breed-select-options').append(`
			<option value="${breed.toLowerCase()}">${breed}</option>
		`)		
	})
}

// Listen for different types of submissions
function formListener(){

	// Prevent all default form submissions
	$('form').submit(e => {
		e.preventDefault()
		$('.dog-results').empty();
	});

	$('#dog-query').submit(e => {
		let dogCount = $('.dog-quantity').val();
		if(dogCount > 50){
			$errorHandlerDOM("You cannot select more than 50 images. Please select a smaller number.");
		} else {
			getDogImages(dogCount);
		}
	});

	$('#breed-search').submit(e => {
		let breedName = $('.breed-name').val().toLowerCase();
		findBreedImg(breedName);
	});

	$('#breed-select').submit(e => {
		let breedName = $('.breed-select-options').val();
		findBreedImg(breedName);
	});
}

// Handle error cases
function errorHandler(res){
	if(!res.ok){ 
		throw Error(res.statusText);
	}
	return res;
}

function $errorHandlerDOM(msg){
	$('.error').text(msg).fadeIn(200).delay(3000).fadeOut(1000); 
}
$(function(){
	findBreeds();
	formListener();
})