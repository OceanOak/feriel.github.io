document.addEventListener('DOMContentLoaded', function () {
    const terminalContent = document.getElementById('terminal-content');
    const terminalPrompt = document.getElementById('terminal-prompt');
    const terminalInputPlaceholder = document.getElementById('terminal-input-placeholder');
    const pulsingCursor = document.querySelector('.inline-block.animate-pulse');

    // Create but don't insert the input element yet
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'terminal-input';
    input.className = 'bg-transparent outline-none text-gray-200 w-full';
    input.autocomplete = 'off';
    input.autocorrect = 'off';
    input.autocapitalize = 'off';
    input.spellcheck = false;

    // Command history
    let commandHistory = [];
    let historyIndex = -1;

    const commands = {
        help: 'Display this help menu',
        week: 'Access specific week\'s dev challenges',
        clear: 'Clear terminal screen'
    };

    // Track if input is active
    let inputActive = false;

    // Only replace the placeholder when terminal is clicked
    terminalContent.addEventListener('click', function () {
        if (!inputActive) {
            activateInput();
        } else {
            input.focus();
        }
    });

    function activateInput() {
        if (terminalInputPlaceholder && !inputActive) {
            const inputContainer = terminalInputPlaceholder.parentNode;
            inputContainer.replaceChild(input, terminalInputPlaceholder);

            // Remove the blinking cursor
            const cursor = inputContainer.querySelector('.animate-pulse');
            if (cursor) cursor.remove();

            inputActive = true;
            input.focus();
        }
    }

    function deactivateInput() {
        if (inputActive && input.parentNode) {
            // Only deactivate if input is empty
            if (input.value === '') {
                const inputContainer = input.parentNode;

                // Recreate the placeholder and cursor
                const placeholder = document.createElement('span');
                placeholder.id = 'terminal-input-placeholder';
                placeholder.className = 'text-gray-400';
                placeholder.textContent = 'Type a command...';

                const cursor = document.createElement('span');
                cursor.className = 'inline-block w-1 h-4 bg-gray-400 ml-1 animate-pulse';

                inputContainer.replaceChild(placeholder, input);
                inputContainer.appendChild(cursor);

                inputActive = false;
            }
        }
    }

    // Function to check if a page exists
    async function checkPageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error('Error checking page existence:', error);
            return false;
        }
    }

    // Handle command execution
    async function executeCommand(command) {
        // Add command to history
        if (command.trim() !== '') {
            commandHistory.unshift(command);
            historyIndex = -1;
        }

        // Process command
        const args = command.trim().split(' ');
        const cmd = args[0].toLowerCase();
        const param = args[1];

        // Create new command output
        const output = document.createElement('div');
        output.className = 'mb-4';

        // Add command to output
        const commandLine = document.createElement('div');
        commandLine.innerHTML = `<span class="text-[#DCA2DC]">></span> ${command}`;
        output.appendChild(commandLine);

        // Command responses
        const responseContainer = document.createElement('div');
        responseContainer.className = 'mt-2 pl-4';

        if (cmd === 'help') {
            // Display help menu
            let helpText = '';
            helpText += `<div class="flex">
    <div class="w-44 text-gray-400">help</div>
    <div class="text-gray-400">${commands.help}</div>
  </div>`;
            helpText += `<div class="flex">
    <div class="w-44 text-gray-400">week [number]</div>
    <div class="text-gray-400">${commands.week}</div>
  </div>`;
            helpText += `<div class="flex">
    <div class="w-44 text-gray-400">clear</div>
    <div class="text-gray-400">${commands.clear}</div>
  </div>`;
            responseContainer.innerHTML = helpText;
        } else if (cmd === 'week') {
            if (param && !isNaN(param)) {
                const weekNum = parseInt(param);

                if (weekNum >= 1 && weekNum <= 100) {
                    const weekUrl = `/week${weekNum}.html`;

                    // Show "checking..." message while we verify if the page exists
                    responseContainer.innerHTML = `Checking week ${weekNum}...`;
                    output.appendChild(responseContainer);
                    terminalContent.insertBefore(output, terminalPrompt);

                    // Check if the page exists before navigating
                    const pageExists = await checkPageExists(weekUrl);

                    if (pageExists) {
                        // Update the response if the page exists
                        responseContainer.innerHTML = `
                          Navigating to Week ${weekNum}...<br>
                          <a href="${weekUrl}" class="text-[#A3D3FE] underline">Click here</a> if you're not automatically redirected.
                        `;

                        // Add a delay before navigation to show the message
                        setTimeout(() => {
                            window.location.href = weekUrl;
                        }, 1000);
                    } else {
                        // Update the response if the page doesn't exist
                        responseContainer.innerHTML = `
                          <span class="text-yellow-400">Week ${weekNum} hasn't been published yet.</span><br>
                          Check back later for updates.
                        `;
                    }
                } else {
                    responseContainer.innerHTML = `Error: Week number must be between 1 and 100.`;
                }
            } else {
                // No number provided
                responseContainer.innerHTML = `Please specify a week number: <span class="text-purple-300">week [number]</span>`;
            }
        } else if (cmd === 'clear') {
            if (terminalContent) {
                const allOutputs = terminalContent.querySelectorAll('div.mb-4');
                allOutputs.forEach(el => el.remove());
                input.value = '';
            }
            return;
        } else if (cmd === '') {
            // Empty command
            return;
        } else {
            responseContainer.innerHTML = `Command not found: <span class="text-red-400">${cmd}</span>. Type <span class="text-purple-300">help</span> to see available commands.`;
        }

        output.appendChild(responseContainer);

        // Insert the output before the prompt
        if (terminalPrompt && terminalContent) {
            terminalContent.insertBefore(output, terminalPrompt);
        }

        // Clear input
        input.value = '';
    }

    // Handle input keypress
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            executeCommand(input.value);
        } else if (e.key === 'ArrowUp') {
            // Browse command history
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
                // Move cursor to end
                setTimeout(() => input.selectionStart = input.selectionEnd = input.value.length, 0);
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            } else if (historyIndex === 0) {
                historyIndex = -1;
                input.value = '';
            }
            e.preventDefault();
        } else if (e.key === 'Escape') {
            // Deactivate input on Escape
            input.value = '';
            deactivateInput();
            e.preventDefault();
        }
    });

    // Deactivate input when clicking elsewhere
    document.addEventListener('click', function (e) {
        if (inputActive && !terminalContent.contains(e.target)) {
            deactivateInput();
        }
    });

    activateInput();
});