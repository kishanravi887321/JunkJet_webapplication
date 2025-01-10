import bcrypt from 'bcrypt';

// Example hashed password (stored in the database)
const hashedPassword = "$2b$10$vMN92LUuS9zmwkCeqch7xOT/451p4Hav42SMH17Azauma7eNg0tFq"; // hash of 'mypassword'

// Function to verify the password
const verifyPassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        if (isMatch) {
            console.log("Password is correct!");
        } else {
            console.log("Password is incorrect!");
        }
        return isMatch;
    } catch (error) {
        console.error("Error verifying password:", error.message);
        throw error;
    }
};

// Example usage
const plainPassword = "ravikishan"; // Input password to verify
verifyPassword(plainPassword, hashedPassword);

function Ravi1() {
    return "hello world";
}


//  hello 

export { Ravi1 };
