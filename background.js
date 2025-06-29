chrome.action.onClicked.addListener(async (tab) => {
  // Get selected text from the page
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => window.getSelection().toString(),
    },
    async (injectionResults) => {
      const selectedText = injectionResults[0]?.result || "";

      // Show prompt to allow user to edit or enter new prompt
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (defaultText) => {
          const userInput = prompt("Edit your prompt for Gemini:", defaultText);
          return userInput;
        },
        args: [selectedText],
      }, async (results) => {
        const editedPrompt = results[0]?.result;

        if (!editedPrompt || editedPrompt.trim() === "") {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => alert("Prompt cancelled or empty."),
          });
          return;
        }

        try {
          const response = await fetch("https://text-extention.onrender.com/proxyserver", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: editedPrompt })
          });

          const data = await response.json();
          const reply = data.result || "No response.";

          // Show response as alert
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (msg, userPrompt) => {
              alert(`You: ${userPrompt}\n\nGemini: ${msg}`);
            },args: [reply, editedPrompt]
          });

        } catch (err) {
          console.error("Fetch error:", err);
        }
      });
    }
  );
});
