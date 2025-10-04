// Initialize Elm app
document.addEventListener('DOMContentLoaded', function() {
    var app = Elm.Main.init({
        node: document.getElementById('app')
    });

    // Terminal CLI functionality - wait for Elm to render
    setTimeout(initializeTerminal, 200);
});

function initializeTerminal() {
    const terminalContent = document.getElementById('terminal-content');
    const terminalPrompt = document.getElementById('terminal-prompt');
    const terminalInputPlaceholder = document.getElementById('terminal-input-placeholder');

    if (!terminalContent || !terminalPrompt || !terminalInputPlaceholder) {
        setTimeout(initializeTerminal, 300);
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

    // Command history
    let commandHistory = [];
    let historyIndex = -1;

    const commands = {
        help: 'Display available commands',
        week: 'Navigate to specific week challenges',
        clear: 'Clear terminal output',
        about: 'Learn more about Feriel',
        portfolio: 'View projects and work'
    };

    // Track if input is active
    let inputActive = false;

    // Immediately activate input when clicking anywhere in terminal
    terminalContent.addEventListener('click', function (e) {
        e.stopPropagation();
        
        if (!inputActive) {
            activateInput();
        } else {
            input.focus();
        }
    });

    function activateInput() {
        const placeholder = document.getElementById('terminal-input-placeholder');
        if (!placeholder || !placeholder.parentNode) return;

        // Remove cursor if exists
        const cursor = placeholder.parentNode.querySelector('.terminal-cursor');
        if (cursor) cursor.remove();

        // Replace placeholder with input
        placeholder.parentNode.replaceChild(input, placeholder);
        inputActive = true;
        
        // Focus immediately
        setTimeout(() => input.focus(), 0);
    }

    function deactivateInput() {
        if (!inputActive || !input.parentNode || input.value.trim() !== '') return;

        const inputContainer = input.parentNode;

        // Recreate placeholder and cursor
        const placeholder = document.createElement('span');
        placeholder.id = 'terminal-input-placeholder';
        placeholder.className = 'text-gray-500 font-quicksand';
        placeholder.textContent = 'Type a command...';

        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor inline-block w-2 h-4 ml-1';

        inputContainer.replaceChild(placeholder, input);
        inputContainer.appendChild(cursor);

        inputActive = false;
    }

    // Function to check if a page exists
    async function checkPageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
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
        } else if (cmd === 'portfolio') {
            responseContainer.innerHTML = `
              <div class="space-y-2 cli-output">
                <div>📂 My work includes:</div>
                <div class="pl-4">• Interactive web applications</div>
                <div class="pl-4">• Developer tools and CLIs</div>
                <div class="pl-4">• Creative coding projects</div>
                <div class="pl-4">• Open source contributions</div>
              </div>
            `;
        } else if (cmd === 'reading') {
            responseContainer.innerHTML = `<div class="cli-output">📚 Navigating to Reading page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/reading'; }, 500);
            return;
        } else if (cmd === 'hobbies') {
            responseContainer.innerHTML = `<div class="cli-output">🎨 Navigating to Hobbies page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/hobbies'; }, 500);
            return;
        } else if (cmd === 'projects') {
            responseContainer.innerHTML = `<div class="cli-output">🚀 Navigating to Projects page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/projects'; }, 500);
            return;
        } else if (cmd === 'research') {
            responseContainer.innerHTML = `<div class="cli-output">🔬 Navigating to Research page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/research'; }, 500);
            return;
        } else if (cmd === 'home') {
            responseContainer.innerHTML = `<div class="cli-output">🏠 Navigating to Home page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/'; }, 500);
            return;
        } else if (cmd === 'reading') {
            responseContainer.innerHTML = `<div class="cli-output">📚 Navigating to Reading page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/reading'; }, 500);
            return;
        } else if (cmd === 'hobbies') {
            responseContainer.innerHTML = `<div class="cli-output">🎨 Navigating to Hobbies page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/hobbies'; }, 500);
            return;
        } else if (cmd === 'projects') {
            responseContainer.innerHTML = `<div class="cli-output">🚀 Navigating to Projects page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/projects'; }, 500);
            return;
        } else if (cmd === 'research') {
            responseContainer.innerHTML = `<div class="cli-output">🔬 Navigating to Research page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/research'; }, 500);
            return;
        } else if (cmd === 'home') {
            responseContainer.innerHTML = `<div class="cli-output">🏠 Navigating to Home page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/'; }, 500);
            return;
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
}

// CLI Modal functionality for content pages
document.addEventListener('DOMContentLoaded', function() {
    // Use a MutationObserver to detect when CLI elements are added
    const observer = new MutationObserver(function() {
        const cliToggleButton = document.getElementById('cli-toggle-button');
        const cliModal = document.getElementById('cli-modal');
        
        if (cliToggleButton && cliModal && !cliToggleButton.dataset.initialized) {
            console.log('CLI modal elements found, initializing...');
            cliToggleButton.dataset.initialized = 'true';
            
            const cliCloseButton = document.getElementById('cli-close-button');
            
            // Open modal
            cliToggleButton.addEventListener('click', function(e) {
                console.log('CLI button clicked');
                e.preventDefault();
                e.stopPropagation();
                cliModal.classList.remove('hidden');
                cliModal.classList.add('flex');
                // Initialize modal terminal after opening
                setTimeout(initializeModalTerminal, 100);
            });
            
            // Close modal
            if (cliCloseButton) {
                cliCloseButton.addEventListener('click', function(e) {
                    console.log('Close button clicked');
                    e.stopPropagation();
                    cliModal.classList.add('hidden');
                    cliModal.classList.remove('flex');
                });
            }
            
            // Close on background click
            cliModal.addEventListener('click', function(e) {
                if (e.target === cliModal) {
                    console.log('Background clicked');
                    cliModal.classList.add('hidden');
                    cliModal.classList.remove('flex');
                }
            });
            
            // Prevent closing when clicking inside terminal
            const terminalContent = cliModal.querySelector('.bg-gray-900');
            if (terminalContent) {
                terminalContent.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
        }
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Also try direct initialization after a delay
    setTimeout(function() {
        const cliToggleButton = document.getElementById('cli-toggle-button');
        const cliModal = document.getElementById('cli-modal');
        
        if (cliToggleButton && cliModal && !cliToggleButton.dataset.initialized) {
            console.log('CLI modal elements found via timeout, initializing...');
            cliToggleButton.dataset.initialized = 'true';
            
            const cliCloseButton = document.getElementById('cli-close-button');
            
            cliToggleButton.addEventListener('click', function(e) {
                console.log('CLI button clicked');
                e.preventDefault();
                e.stopPropagation();
                cliModal.classList.remove('hidden');
                cliModal.classList.add('flex');
                setTimeout(initializeModalTerminal, 100);
            });
            
            if (cliCloseButton) {
                cliCloseButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    cliModal.classList.add('hidden');
                    cliModal.classList.remove('flex');
                });
            }
            
            cliModal.addEventListener('click', function(e) {
                if (e.target === cliModal) {
                    cliModal.classList.add('hidden');
                    cliModal.classList.remove('flex');
                }
            });
            
            const terminalContent = cliModal.querySelector('.bg-gray-900');
            if (terminalContent) {
                terminalContent.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
        }
    }, 500);
});

function initializeModalTerminal() {
    const terminalContent = document.getElementById('terminal-content-modal');
    const terminalPrompt = document.getElementById('terminal-prompt-modal');
    const terminalInputPlaceholder = document.getElementById('terminal-input-placeholder-modal');

    if (!terminalContent || !terminalPrompt || !terminalInputPlaceholder || terminalContent.dataset.initialized) {
        return;
    }
    
    // Mark as initialized
    terminalContent.dataset.initialized = 'true';
    console.log('Initializing modal terminal...');

    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'terminal-input-modal';
    input.className = 'bg-transparent outline-none text-white w-full font-firacode';
    input.autocomplete = 'off';
    input.autocorrect = 'off';
    input.autocapitalize = 'off';
    input.spellcheck = false;

    // Command history
    let commandHistory = [];
    let historyIndex = -1;

    const commands = {
        help: 'Display available commands',
        week: 'Navigate to specific week challenges',
        clear: 'Clear terminal output',
        about: 'Learn more about Feriel',
        portfolio: 'View projects and work'
    };

    // Track if input is active
    let inputActive = false;

    // Activate input when clicking anywhere in terminal
    terminalContent.addEventListener('click', function (e) {
        e.stopPropagation();
        
        if (!inputActive) {
            activateInput();
        } else {
            input.focus();
        }
    });

    function activateInput() {
        const placeholder = document.getElementById('terminal-input-placeholder-modal');
        if (!placeholder || !placeholder.parentNode) return;

        // Remove cursor if exists
        const cursor = placeholder.parentNode.querySelector('.terminal-cursor');
        if (cursor) cursor.remove();

        // Replace placeholder with input
        placeholder.parentNode.replaceChild(input, placeholder);
        inputActive = true;
        
        // Focus immediately
        setTimeout(() => input.focus(), 0);
    }

    function deactivateInput() {
        if (!inputActive || !input.parentNode || input.value.trim() !== '') return;

        const inputContainer = input.parentNode;

        // Recreate placeholder and cursor
        const placeholder = document.createElement('span');
        placeholder.id = 'terminal-input-placeholder-modal';
        placeholder.className = 'text-gray-500 font-quicksand';
        placeholder.textContent = 'Type a command...';

        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor inline-block w-2 h-4 ml-1';

        inputContainer.replaceChild(placeholder, input);
        inputContainer.appendChild(cursor);

        inputActive = false;
    }

    // Function to check if a page exists
    async function checkPageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
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
        commandLine.innerHTML = `<div class="flex items-center"><span class="cli-prompt mr-2">❯</span><span class="cli-command">${command}</span></div>`;
        output.appendChild(commandLine);

        // Command responses
        const responseContainer = document.createElement('div');
        responseContainer.className = 'mt-2 pl-4 cli-output';

        if (cmd === 'help') {
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

                    responseContainer.innerHTML = `<span class="cli-output">🔍 Checking week ${weekNum}...</span>`;
                    output.appendChild(responseContainer);
                    terminalContent.insertBefore(output, terminalPrompt);

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
        } else if (cmd === 'portfolio') {
            responseContainer.innerHTML = `
              <div class="space-y-2 cli-output">
                <div>📂 My work includes:</div>
                <div class="pl-4">• Interactive web applications</div>
                <div class="pl-4">• Developer tools and CLIs</div>
                <div class="pl-4">• Creative coding projects</div>
                <div class="pl-4">• Open source contributions</div>
              </div>
            `;
        } else if (cmd === 'reading') {
            responseContainer.innerHTML = `<div class="cli-output">📚 Navigating to Reading page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/reading'; }, 500);
            return;
        } else if (cmd === 'hobbies') {
            responseContainer.innerHTML = `<div class="cli-output">🎨 Navigating to Hobbies page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/hobbies'; }, 500);
            return;
        } else if (cmd === 'projects') {
            responseContainer.innerHTML = `<div class="cli-output">🚀 Navigating to Projects page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/projects'; }, 500);
            return;
        } else if (cmd === 'research') {
            responseContainer.innerHTML = `<div class="cli-output">🔬 Navigating to Research page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/research'; }, 500);
            return;
        } else if (cmd === 'home') {
            responseContainer.innerHTML = `<div class="cli-output">🏠 Navigating to Home page...</div>`;
            output.appendChild(responseContainer);
            terminalContent.insertBefore(output, terminalPrompt);
            setTimeout(() => { window.location.href = '/'; }, 500);
            return;
        } else if (cmd === 'clear') {
            if (terminalContent) {
                const allOutputs = terminalContent.querySelectorAll('div.mb-4');
                allOutputs.forEach(el => el.remove());
                input.value = '';
            }
            return;
        } else if (cmd === '') {
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
            // Close the modal on Escape
            const cliModal = document.getElementById('cli-modal');
            if (cliModal) {
                cliModal.classList.add('hidden');
                cliModal.classList.remove('flex');
            }
            e.preventDefault();
        }
    });
}
