export function generateRandomAWB(): string {
    // AWBN is a fixed prefix
    const prefix = 'AWBN';
    // Generate 11 random digits
    let digits = '';
    for (let i = 0; i < 11; i++) {
        // Math.floor(Math.random() * 10) generates a random digit between 0 and 9
        digits += Math.floor(Math.random() * 10);
    }
    // Concatenate the prefix and the digits
    return prefix + digits;
}
