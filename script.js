// Beginner-friendly JavaScript to connect buttons to OpenAI and show the response

// Make sure to include secrets.js in your HTML before this script:
// <script src="secrets.js"></script>
// secrets.js should define: const apiKey = 'YOUR_OPENAI_API_KEY';
// The apiKey variable will be available here because it's defined globally.

// System messages for different contexts
const systemMessages = {
  meeting: "You are a friendly, helpful assistant for team meetings. Keep responses professional, positive, and concise.",
  classroom: "You are a fun, encouraging assistant for a classroom. Use simple words and keep things light and educational.",
  gamenight: "You are a playful, energetic assistant for game nights. Make responses lively and fun for everyone!"
};

// Persona system messages
const personaMessages = {
  friendlyCoworker: "", // No extra instruction
  sassyIntern: "Respond in the voice of a friendly, casual intern who uses emojis.",
  professorBot: "Respond in the voice of a knowledgeable professor who explains things clearly."
};

// Get the dropdown elements
const contextDropdown = document.getElementById('contextDropdown');
const personaDropdown = document.getElementById('personaDropdown');

// This function gets the current system message based on the dropdowns
function getSystemMessage() {
  // Get the selected values from the dropdowns
  const context = contextDropdown.value;
  const persona = personaDropdown.value;
  // Get base system message
  let baseMessage = systemMessages[context] || systemMessages.meeting;
  // Get persona message
  let personaMsg = personaMessages[persona] || "";
  // Combine them
  if (personaMsg) {
    baseMessage = `${baseMessage} ${personaMsg}`;
  }
  return baseMessage;
}

// This function sends a prompt to OpenAI and gets a response
async function getOpenAIResponse(userPrompt) {
  // Use the apiKey from secrets.js
  // Make sure secrets.js is loaded before this script
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  // Get the system message for the selected context
  const systemMessage = getSystemMessage();

  // Prepare the messages for OpenAI: system + user
  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: userPrompt }
  ];

  // Set up the request options
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4.1',
      messages: messages,
      max_tokens: 60
    })
  };

  try {
    // Fetch the response from OpenAI
    const response = await fetch(endpoint, options);
    const data = await response.json();
    // Return the generated message
    return data.choices[0].message.content.trim();
  } catch (error) {
    // If there's an error, show a message
    return 'Sorry, something went wrong. Please try again.';
  }
}

// This function handles button clicks
async function handleButtonClick(type) {
  // Set the prompt based on the button type
  let prompt = '';
  if (type === 'icebreaker') {
    prompt = 'Give me a simple icebreaker question for a group of new friends.';
  } else if (type === 'funfact') {
    prompt = 'Share a fun fact that is interesting and easy to understand.';
  } else if (type === 'joke') {
    prompt = 'Tell me a friendly, clean joke suitable for all ages.';
  } else if (type === 'weather') {
    prompt = 'Write a friendly prompt encouraging people to share what the weather is like in their location.';
  }

  // Show a loading message
  const output = document.getElementById('response');
  output.textContent = 'Loading...';

  // Get the response from OpenAI
  const aiResponse = await getOpenAIResponse(prompt);

  // Display the response on the page
  output.textContent = aiResponse;
}

// Add event listeners to the buttons after the page loads
window.addEventListener('DOMContentLoaded', () => {
  // Get each button by its ID and add a click event listener
  document.getElementById('iceBtn').addEventListener('click', () => handleButtonClick('icebreaker'));
  document.getElementById('factBtn').addEventListener('click', () => handleButtonClick('funfact'));
  document.getElementById('jokeBtn').addEventListener('click', () => handleButtonClick('joke'));
  document.getElementById('weatherBtn').addEventListener('click', () => handleButtonClick('weather'));
});