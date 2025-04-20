// Content script for PostPal - LinkedIn integration

// Function to add the "New Post with AI" button
function addNewPostButton() {
  // Check if we're on LinkedIn
  if (!window.location.hostname.includes('linkedin.com')) {
    return;
  }

  // Find the "Start a post" button
  const feedInterval = setInterval(() => {
    const postButtons = document.querySelectorAll('[aria-label="Start a post"]');
    
    if (postButtons && postButtons.length > 0) {
      clearInterval(feedInterval);
      
      // Create our custom button
      postButtons.forEach(button => {
        const buttonContainer = button.closest('.share-box-feed-entry__trigger-container');
        if (buttonContainer && !buttonContainer.querySelector('.postpal-button')) {
          const newPostButton = document.createElement('button');
          newPostButton.className = 'postpal-button';
          newPostButton.innerText = '📝 New Post with AI';
          newPostButton.style.cssText = `
            background-color: #0a66c2;
            color: white;
            border: none;
            border-radius: 12px;
            padding: 4px 8px;
            font-weight: 600;
            margin-left: 8px;
            cursor: pointer;
            font-size: 13px;
          `;
          
          // Add click event to open the extension popup
          newPostButton.addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'openPopup' });
          });
          
          // Insert button next to the original
          buttonContainer.appendChild(newPostButton);
        }
      });
    }
  }, 1000);
}

// Function to insert content into LinkedIn's post editor
function insertTextIntoEditor(text) {
  // Try different LinkedIn editor selectors
  const editorSelectors = [
    '.ql-editor',                               // Standard editor
    '.editor-content [contenteditable="true"]', // Post modal editor
    '.mentions-texteditor__contenteditable',    // Alternative editor format
    '[data-placeholder="What do you want to talk about?"]', // New post editor
    '[role="textbox"]',                         // Generic role-based selector
    '.artdeco-text-input__input'                // LinkedIn form inputs
  ];
  
  for (const selector of editorSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements && elements.length > 0) {
      for (const editor of elements) {
        // Check if this element is visible and editable
        if (editor.offsetParent !== null && 
            (editor.isContentEditable || editor.tagName === 'TEXTAREA')) {
          
          // Insert content differently based on element type
          if (editor.isContentEditable) {
            editor.innerHTML = `<p>${text}</p>`;
          } else {
            editor.value = text;
          }
          
          // Dispatch multiple events to ensure LinkedIn recognizes the change
          const events = ['input', 'change', 'blur', 'focus'];
          events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            editor.dispatchEvent(event);
          });
          
          console.log('Content inserted successfully using selector:', selector);
          return true;
        }
      }
    }
  }
  
  console.error('No suitable editor element found for insertion');
  return false;
}

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'insertContentIntoEditor' && request.text) {
    const success = insertTextIntoEditor(request.text);
    sendResponse({ success });
  }
  return true;
});

// Initialize the extension
function init() {
  addNewPostButton();
  
  // Re-run when LinkedIn's SPA navigation happens
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        addNewPostButton();
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Start the extension
init(); 