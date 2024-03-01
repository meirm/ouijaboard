
// Define positions for yes, no, alphabet, and numbers
const ouijaBoard = document.getElementById("ouijaBoard");

// Query the server for a response with the content of the message input field, call animateMessage with the response and display it in the message output field once the animation is done
async function queryServer() {
    const message = document.getElementById("messageInput").value;
    const url = '/api/ouija';
    const data = { message: message };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        return responseData; // This will be a Promise resolving to your actual data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow or handle error as needed
    }
}

function animateMessage() {
    const input = document.getElementById("messageInput").value.toUpperCase(); // Ensure uppercase to match letters
    document.getElementById("messageOutput").value = "";
    queryServer().then(data => {
        animateMessageOutput(data["response"]);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}

function animateMessageOutput(output) {
    output = output.toUpperCase(); // Ensure uppercase to match letters
    const output_length = output.length;
    var waitBeforeFillingTextBox = 2000;
    // check if the output is in the list of predefined responses, if it is then wait only 1 second before filling the text box
    if (output == "YES" || output == "NO" || output == "GOODBYE") {
        waitBeforeFillingTextBox = 2000;
    }else{
        waitBeforeFillingTextBox =  output_length * 1700;
    }
    setTimeout(function() {
        document.getElementById("messageOutput").value = output;
        document.getElementById("messageInput").value = "";
    }, waitBeforeFillingTextBox + 1000);
    let index = 0;
  

    switch (output) {
      case "YES":
        output = "Yes";
        moveTo(output);
        break;
      case "NO":
        output = "No";
        moveTo(output);
        break;
      case "GOODBYE":
        output = "Goodbye";
        moveTo(output);
        break;
      default:
      spellWord(output);
        break;
    }    
  }
  
  // Your existing moveTo and spellWord functions here, if needed    
  const positions = {
    // Define positions for each letter/symbol on the board
  'rest_position': { x: 275, y: 195, r: 0 }, // Add a rest position for the planchette
  ' ': { x: 275, y: 195, r: 0 }, // Add a rest position for the planchette
  'A': { x: 80, y: 135, r: -35},
  'B': { x: 115, y: 110,r: -30},
  'C': { x: 150, y: 100, r: -25},
  'D': { x: 180, y: 90, r: -20},
  'E': { x: 213, y: 85, r: -15},
  'F': { x: 240, y: 80, r: -5},
  'G': { x: 275, y: 80, r: 0},
  'H': { x: 312, y: 80, r: 5},
  'I': { x: 340, y: 85, r: 10},
  'J': { x: 365, y: 87, r: 15},
  'K': { x: 400, y: 100, r: 20},
  'L': { x: 430, y: 110, r: 25},
  'M': { x: 470, y: 130, r: 30},
  'N': { x: 85, y: 200, r: -30},
    'O': { x: 115, y: 180,r: -25},
    'P': { x: 145, y: 165, r: -25},
    'Q': { x: 175, y: 150, r: -20},
    'R': { x: 210, y: 140, r: -15},
    'S': { x: 240, y: 135, r: -10},
    'T': { x: 270, y: 130, r: 0},
    'U': { x: 305, y: 130, r: 5},
    'V': { x: 340, y: 135, r: 15},
    'W': { x: 375, y: 145, r: 20},
    'X': { x: 410, y: 160, r: 25},
    'Y': { x: 440, y: 180, r: 30},
    'Z': { x: 470, y: 200, r: 35},
  // Add more positions for each letter/symbol
  'Goodbye': { x: 470, y: 285, r: 255 },
  'No': { x: 425, y: -20, r: 10 },
  'Yes': { x: 135, y: -20, r: -10 },
  '1': { x: 130, y: 265, r: 0},
  '2': { x: 155, y: 265, r: 0},
  '3': { x: 190, y: 265, r: 0},
    '4': { x: 225, y: 265, r: 0},
    '5': { x: 260, y: 265, r: 0},
    '6': { x: 295, y: 265, r: 0},
    '7': { x: 320, y: 265, r: 0},
    '8': { x: 355, y: 265, r: 0},
    '9': { x: 390, y: 265, r: 0},
    '0': { x: 425, y: 265, r: 0},
};

function moveTo(letter) {
  const pos = positions[letter];
  planchette.style.left = pos.x + 'px';
  planchette.style.top = pos.y + 'px';
  planchette.style.rotate = pos.r + 'deg';
}

// Example: Move to 'A'
//moveTo('A');

// To spell out a word, sequence the moves
function spellWord(word) {
  let i = 0;
  function moveNext() {
    if (i < word.length) {
        moveTo("rest_position");
        setTimeout(() => {
            moveTo(word[i]);
            i++;
            setTimeout(moveNext, 1700); // Wait 1 second between moves
        }, 1000);   
    }else{
        moveTo("rest_position");
    }
  }
  moveNext();
}
moveTo("rest_position");
//setTimeout(() => {
// Example usage
//spellWord('A1M8B');
//}, 3000);