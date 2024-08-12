export function isValidEmail(email: string) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
}
export function isValidPhoneNumber(phone: string) {
    const pattern = /^\+?[1-9]\d{1,14}$/;
    return pattern.test(phone);
}