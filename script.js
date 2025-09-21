// Initialize Elm app
document.addEventListener('DOMContentLoaded', function () {
    var app = Elm.Main.init({
        node: document.getElementById('app')
    });

    // Terminal CLI functionality - wait a bit for Elm to render
    setTimeout(initializeTerminal, 100);
});

function initializeTerminal() {
    console.log('Initializing terminal...');

    const terminalContent = document.getElementById('terminal-content');
    const terminalPrompt = document.getElementById('terminal-prompt');
    const terminalInputPlaceholder = document.getElementById('terminal-input-placeholder');

    console.log('Terminal elements:', {
        content: terminalContent,
        prompt: terminalPrompt,
        placeholder: terminalInputPlaceholder
    });

    if (!terminalContent || !terminalPrompt || !terminalInputPlaceholder) {
        console.error('Terminal elements not found, retrying in 500ms...');
        setTimeout(initializeTerminal, 500);
        return;
    }

    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'terminal-input';
    input.className = 'bg-transparent outline-none text-white w-full font-firacode';
    input.autocomplete = 'off';
    input.autocorrect = 'off';
    input.autocapitalize = 'off';
    input.spellcheck = false;
    input.placeholder = '';

    // Command history
    let commandHistory = [];
    let historyIndex = -1;

    const commands = {
        help: 'Display available commands',
        'week [num]': 'Navigate to specific week challenges',
        clear: 'Clear terminal output',
        about: 'Learn more about Feriel',
    };

    // Track if input is active
    let inputActive = false;

    // Terminal click handler
    terminalContent.addEventListener('click', function (e) {
        console.log('Terminal clicked, inputActive:', inputActive);
        e.stopPropagation();

        if (!inputActive) {
            console.log('Activating input...');
            activateInput();
        } else {
            console.log('Input already active, focusing...');
            input.focus();
        }
    });

    function activateInput() {
        const placeholder = document.getElementById('terminal-input-placeholder');
        if (placeholder && placeholder.parentNode) {
            console.log('Replacing placeholder with input');

            // Remove cursor span if it exists
            const cursor = placeholder.parentNode.querySelector('.terminal-cursor');
            if (cursor) cursor.remove();

            // Replace placeholder with input
            placeholder.parentNode.replaceChild(input, placeholder);

            inputActive = true;
            input.focus();
            console.log('Input activated and focused');
        } else {
            console.error('Could not find placeholder element');
        }
    }

    function deactivateInput() {
        if (inputActive && input.parentNode && input.value.trim() === '') {
            console.log('Deactivating input...');

            const inputContainer = input.parentNode;

            // Recreate the placeholder and cursor
            const placeholder = document.createElement('span');
            placeholder.id = 'terminal-input-placeholder';
            placeholder.className = 'text-gray-500 font-quicksand';
            placeholder.textContent = 'Type a command...';

            const cursor = document.createElement('span');
            cursor.className = 'terminal-cursor inline-block w-2 h-4 ml-1';

            inputContainer.replaceChild(placeholder, input);
            inputContainer.appendChild(cursor);

            inputActive = false;
            console.log('Input deactivated');
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
        console.log('Executing command:', command);

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

        // Add command to output with modern styling
        const commandLine = document.createElement('div');
        commandLine.innerHTML = `<div class="flex items-center"><span class="cli-prompt mr-2">❯</span><span class="cli-command">${command}</span></div>`;
        output.appendChild(commandLine);

        // Command responses
        const responseContainer = document.createElement('div');
        responseContainer.className = 'mt-2 pl-4 cli-output';

        if (cmd === 'help') {
            // Display help menu with modern styling
            let helpText = '<div class="space-y-2">';
            Object.entries(commands).forEach(([cmd, desc]) => {
                helpText += `<div class="flex">
                    <div class="w-24 cli-command font-firacode">${cmd}</div>
                    <div class="text-gray-300 font-quicksand">${desc}</div>
                </div>`;
            });
            helpText += '</div>';
            responseContainer.innerHTML = helpText;
        } else if (cmd === 'week') {
            if (param && !isNaN(param)) {
                const weekNum = parseInt(param);

                if (weekNum >= 1 && weekNum <= 100) {
                    const weekUrl = `/week${weekNum}.html`;

                    // Show "checking..." message
                    responseContainer.innerHTML = `<span class="cli-output">🔍 Checking week ${weekNum}...</span>`;
                    output.appendChild(responseContainer);
                    terminalContent.insertBefore(output, terminalPrompt);

                    // Check if the page exists
                    const pageExists = await checkPageExists(weekUrl);

                    if (pageExists) {
                        responseContainer.innerHTML = `
                          <div class="space-y-1">
                            <div class="cli-output">✅ Week ${weekNum} found!</div>
                            <div class="cli-output">🚀 <a href="${weekUrl}" class="cli-command underline hover:no-underline">Navigate to Week ${weekNum}</a></div>
                          </div>
                        `;

                        setTimeout(() => {
                            window.location.href = weekUrl;
                        }, 1000);
                    } else {
                        responseContainer.innerHTML = `
                          <div class="space-y-1">
                            <div class="cli-warning">⚠️ Week ${weekNum} hasn't been published yet</div>
                            <div class="cli-output">Check back later for updates! 📅</div>
                          </div>
                        `;
                    }
                } else {
                    responseContainer.innerHTML = `<span class="cli-error">❌ Week number must be between 1 and 100</span>`;
                }
            } else {
                responseContainer.innerHTML = `<span class="cli-output">📝 Usage: <span class="cli-command">week [number]</span></span>`;
            }
        } else if (cmd === 'about') {
            responseContainer.innerHTML = `
              <div class="space-y-2 cli-output">
                <div>👋 Hi! I'm Feriel, a developer passionate about creating accessible products</div>
                <div>🛠️ I love transforming complex ideas into simple, user-friendly solutions</div>
                <div>🚀 Currently working on my 100 weeks of development challenges</div>
              </div>
            `;
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
            responseContainer.innerHTML = `<div class="space-y-1"><span class="cli-error">❌ Command not found: ${cmd}</span><div class="cli-output">Type <span class="cli-command">help</span> to see available commands</div></div>`;
        }

        output.appendChild(responseContainer);

        // Insert the output before the prompt
        if (terminalPrompt && terminalContent) {
            terminalContent.insertBefore(output, terminalPrompt);

            // Auto-scroll to bottom
            const scrollContainer = terminalContent.parentElement;
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }

        // Clear input
        input.value = '';
    }

    // Handle input keypress
    input.addEventListener('keydown', function (e) {
        console.log('Key pressed:', e.key);

        if (e.key === 'Enter') {
            executeCommand(input.value);
        } else if (e.key === 'ArrowUp') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
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
            input.value = '';
            input.blur();
            deactivateInput();
            e.preventDefault();
        }
    });

    // Click outside to deactivate (only if empty)
    document.addEventListener('click', function (e) {
        if (inputActive && !terminalContent.contains(e.target)) {
            if (input.value.trim() === '') {
                deactivateInput();
            }
        }
    });

    console.log('Terminal initialization complete');
}
