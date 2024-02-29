// Import the readline-sync library for synchronous user input
const readlineSync = require('readline-sync');

// Room objects representing different locations in the game
const street = {
    address: 'Street',
    description: `
        Welcome, Realtor! I hope you are aware this house is haunted!
        You have been informed there is a lockbox on the ground along with a sign that can be read using "read sign" command.`,
    options: ['Hallway'],
    inventory: [],
};

const hallway = {
    address: 'Hallway',
    description: `
        You are in the Hallway. To enter the Bedroom, use the command "enter bedroom". 
        To enter the Closet, use the command "enter closet". 
        To enter the Living Room, use the command "enter living room". 
        To exit the house and return to the Street, use the command "exit house".`,
    options: ['Bedroom', 'Closet', 'Living Room'],
    inventory: [],
};

const bedroom = {
    address: 'Bedroom',
    description: `
        Welcome to the Bedroom. To return to the Hallway, use the command "exit bedroom".`,
    options: ['Hallway'],
    inventory: [],
};

const closet = {
    address: 'Closet',
    description: `
        You have entered the closet. To exit use the command "exit closet".`,
    options: ['Hallway'],
    inventory: [],
};

const livingRoom = {
    address: 'Living Room',
    description: `
        You have entered the living room. To exit, use the command "exit living room".`,
    options: ['Hallway'],
    inventory: [],
};

// Lockbox object containing information about the lockbox
const lockbox = {
    locked: true,
    containsKey: false,
    code: '12345',
};

// Front door key object with a name and a use function
const key = {
    name: 'The front door key',
    use: function () {
        console.log('You unlock the front door. Congratulations! You have entered the front hallway. To explore the house further, enter one of the following commands: "enter bedroom", "enter closet", or "exit house"');
    },
};

// Player's initial room set to the Street
let currentRoom = street;

// Function to display the current room's information
function displayRoom() {
    if (currentRoom.address !== 'Street') {
        console.log(`
Status: Current Location: ${currentRoom.address}
Your Inventory: ${currentRoom.inventory.map(item => item.name).join(', ')}`);
    } else {
        console.log(`
Status: Current Location: ${currentRoom.address}`);
    }
}

// Function to handle user commands
function handleCommand(command) {
    switch (command.toLowerCase()) {
        case 'read sign':
            console.log(`The sign says: "Use 'open lockbox' and enter the code (${lockbox.code}) to reveal the keypad." Do not take the sign, leave it for the next person!`);
            break;
        case 'take sign':
            console.log(`If you take the sign, how will others find their way?`);
            break;

        case 'open lockbox':
            if (lockbox.locked) {
                const code = readlineSync.question('Enter the code: ');
                if (code === lockbox.code) {
                    console.log('Success! The lockbox opens. Instruction: To take the key, use the command "take key". Once you have the key in your possession, you can use the "use key" command.');
                    lockbox.locked = false;
                    lockbox.containsKey = true;
                } else {
                    console.log('Incorrect code. The lockbox remains locked.');
                }
            } else {
                console.log('The lockbox is already open. Use "take key" to get the key.');
            }
            break;

        case 'take key':
            if (!lockbox.containsKey) {
                console.log('There is no key in the lockbox to take.');
            } else {
                currentRoom.inventory.push(key);
                console.log('You take the front door key from the lockbox.');
                lockbox.containsKey = false;
                const useKey = readlineSync.keyInYNStrict('Would you like to use the key now?');
                if (useKey) {
                    key.use();
                    if (currentRoom.address === 'Street') {
                        currentRoom = hallway;
                        currentRoom.inventory.push(key);
                    }
                }
            }
            break;

        case 'use key':
            if (currentRoom.address === 'Street') {
                key.use();
                currentRoom = hallway;
                currentRoom.inventory.push(key);
            } else if (currentRoom.address === 'Hallway') {
                key.use();
                console.log('The key is in your inventory.');
            } else {
                console.log('You need to be in front of the front door to use the key. Explore the house to find it.');
            }
            break;

        case 'enter bedroom':
            if (currentRoom.address === 'Hallway') {
                console.log('You enter the Bedroom. There is dust everywhere. Nobody has slept here in ages. A giant "3" is painted on one wall. Type "exit bedroom" to exit.');
                currentRoom = bedroom;
                currentRoom.inventory.push(...street.inventory);
            } else {
                console.log('Invalid command. You must be in the hallway to use the "enter bedroom" command.');
            }
            break;

        case 'enter closet':
            if (currentRoom.address === 'Hallway') {
                console.log('You enter the Closet. As you flick on the light, you see a skeleton in the back corner. A giant "2" is painted on the wall. Spooky! Type "exit closet" to exit.');
                currentRoom = closet;
                currentRoom.inventory.push(...street.inventory);
            } else {
                console.log('Invalid command. You must be in the hallway to use the "enter closet" command.');
            }
            break;

        case 'enter living room':
            if (currentRoom.address === 'Hallway') {
                console.log('You enter the Living Room. There is little furniture, including two couches, a rug, and an old television. A giant "5" is painted on the wall. Type "exit living room" to exit.');
                currentRoom = livingRoom;
                currentRoom.inventory.push(...street.inventory);
            } else {
                console.log('Invalid command. You must be in the hallway to use the "enter closet" command.');
            }
            break;

        case 'exit house':
            if (currentRoom.address === 'Hallway' && currentRoom.inventory.includes(key)) {
                console.log('You try to exit the house and return to the Street.');
                const paintedNumbers = readlineSync.question('To leave the haunted house, tell me the product of the three numbers (ex. X times Y times Z) you saw painted on the walls: ');
                const numbers = paintedNumbers.split(' ').map(Number);
                const product = numbers.reduce((acc, num) => acc * num, 1);

                if (product === 30) {
                    console.log('Congratulations! You have successfully left the haunted house. The key has been returned to the lockbox. Thank you for your tour!');
                    lockbox.containsKey = true;
                    currentRoom.inventory = currentRoom.inventory.filter(item => item !== key);
                    currentRoom = street;
                } else {
                    console.log('Incorrect product! You are not allowed to leave the haunted house. The key stays in your inventory, and you remain in the hallway.');
                }
            } else {
                console.log('You can only use the "exit house" command while in the hallway and with the key.');
            }
            break;

        case 'exit bedroom':
            if (currentRoom.address === 'Bedroom') {
                console.log('You exit the Bedroom and return to the Hallway. Enter one of the following commands: "enter bedroom", "enter closet", "enter living room" or "exit house".');
                currentRoom = hallway;
            } else {
                console.log('You can only exit the "exit bedroom" command when you are inside the bedroom.');
            }
            break;

        case 'exit closet':
            if (currentRoom.address === 'Closet') {
                console.log('You exit the Closet and return to the Hallway. Enter one of the following commands: "enter bedroom", "enter closet", "enter living room" or "exit house".');
                currentRoom = hallway;
            } else {
                console.log('You can only use the "exit closet" command while inside the closet.');
            }
            break;

        case 'exit living room':
            if (currentRoom.address === 'Living Room') {
                console.log('You exit the Living Room and return to the Hallway. Enter one of the following commands: "enter bedroom", "enter closet", "enter living room" or "exit house".');
                currentRoom = hallway;
            } else {
                console.log('You can only use the "exit living room" command while in the living room.');
            }
            break;

        default:
            console.log('Invalid command.');
    }
}

// Initial setup and display of the first room's description
console.log(street.description);
displayRoom();

// Game loop for continuous interaction
while (true) {
    const command = readlineSync.question('> ');
    handleCommand(command);
    displayRoom();
}
//git test//