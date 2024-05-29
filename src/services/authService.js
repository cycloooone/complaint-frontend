export function isAuthenticated() {
    const token = sessionStorage.getItem('token');
    return token !== null;
}
  
export function getUserRole() {
    return sessionStorage.getItem('role_name');
}
  