// Background service worker for PostPal extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('PostPal extension installed');
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle content generation requests
  if (request.action === 'generatePost') {
    console.log('Received request to generate content:', request);
    
    try {
      // During development, we'll use a mock response instead of trying to access localhost
      // In production, you would replace this with actual API calls
      const mockText = generateMockResponse(request.prompt, request.type || 'new_post');
      
      // Send the mock response back
      setTimeout(() => {
        sendResponse({ success: true, text: mockText });
      }, 800); // Add a small delay to simulate API call
    } catch (error) {
      console.error('Error generating content:', error);
      sendResponse({ success: false, error: error.message || 'Unknown error occurred' });
    }
    
    return true; // Required to use sendResponse asynchronously
  }
  
  // Handle request to open the popup
  if (request.action === 'openPopup') {
    try {
      chrome.action.openPopup();
      sendResponse({ success: true });
    } catch (error) {
      console.error('Error opening popup:', error);
      sendResponse({ success: false, error: error.message || 'Failed to open popup' });
    }
    return true;
  }
});

// Mock function to simulate OpenAI responses during development
function generateMockResponse(prompt, type) {
  console.log('Generating mock response for prompt:', prompt, 'type:', type);
  
  switch (type) {
    case 'new':
    case 'new_post':
      return `🚀 Exciting News! 🚀

I'm thrilled to announce our latest product update that's going to revolutionize how you work!

We've listened to your feedback and implemented features that will boost your productivity by 50%.

Key highlights:
✅ Streamlined workflow
✅ Advanced AI integration
✅ Improved collaboration tools

Check out the details in the comments below!

#ProductUpdate #Innovation #Productivity`;
    
    case 'reply':
      return `Thank you for sharing these insights! I completely agree that this approach can transform how teams collaborate. I've implemented similar strategies in my organization and seen remarkable results.`;
    
    case 'repost':
      return `I'm sharing this incredible post because it perfectly articulates the challenges we face today. As someone working in this field for over 5 years, I can attest to every point made here. Especially valuable for professionals looking to level up their skills!

#CareerGrowth`;
    
    default:
      return `Generated content based on your request.`;
  }
} 