document.addEventListener('DOMContentLoaded', function () {
    const terminalContent = document.getElementById('terminal-content');
    const terminalPrompt = document.getElementById('terminal-prompt');
    const terminalInputPlaceholder = document.getElementById('terminal-input-placeholder');

    // Command history
    let commandHistory = [];
    let historyIndex = -1;

    const commands = {
        help: 'Display this help menu',
        week: 'Access specific week\'s dev challenges',
        clear: 'Clear terminal screen'
    };

    // Create an input element
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'terminal-input';
    input.className = 'bg-transparent outline-none text-gray-200 w-full';
    input.autocomplete = 'off';
    input.autocorrect = 'off';
    input.autocapitalize = 'off';
    input.spellcheck = false;

    // Replace the placeholder with the input
    if (terminalInputPlaceholder) {
        const inputContainer = terminalInputPlaceholder.parentNode;
        inputContainer.replaceChild(input, terminalInputPlaceholder);

        // Remove the blinking cursor if it exists
        const cursor = inputContainer.querySelector('.animate-pulse');
        if (cursor) cursor.remove();
    } else {
        console.error('Terminal input placeholder not found');
    }

    // Focus input when terminal is clicked
    if (terminalContent) {
        terminalContent.addEventListener('click', function () {
            input.focus();
        });
    }

    // Handle command execution
    function executeCommand(command) {
        // Add command to history
        if (command.trim() !== '') {
            commandHistory.unshift(command);
            historyIndex = -1;
        }

        // Process command
        const args = command.trim().split(' ');
        const cmd = args[0].toLowerCase();
        const param = args[1]; // Added this line to define param

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
                // Handle week command (todo)
                responseContainer.textContent = `Accessing development challenges for week ${param}...`;
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
        }
    });

    // Auto-focus the input when the page loads
    input.focus();
});