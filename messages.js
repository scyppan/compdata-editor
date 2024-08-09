function createMessage(message, type = 'info') {
    // Create the modal container
    const modal = document.createElement('div');
    modal.classList.add('message-modal', type);

    // Create the message text element
    const messageText = document.createElement('span');
    messageText.textContent = message;
    modal.appendChild(messageText);

    // Calculate the top position based on existing modals
    const existingModals = document.querySelectorAll('.message-modal');
    const offset = 50; // Offset between messages
    const baseTop = 10; // Base top position
    const topPosition = baseTop + (existingModals.length * (modal.offsetHeight + offset));
    modal.style.top = `${topPosition}px`;

    // Append the modal to the body
    document.body.appendChild(modal);

    // Add animation classes for pop in and fade out
    setTimeout(() => {
        modal.classList.add('fade-out');
    }, 3000); // Duration before starting to fade out

    // Remove the modal after animation completes
    setTimeout(() => {
        modal.remove();
    }, 4000); // Duration to fully disappear
}