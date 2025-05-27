// src/services/AuthService.js
export const login = async (email, password) => {
  const response = await fetch(`http://localhost:3001/users?email=${email}`);
  const users = await response.json();
  
  if (users.length === 0) {
    throw new Error('Invalid email or password');
  }
  
  const user = users[0];
  
  if (user.password !== password) {
    throw new Error('Invalid email or password');
  }
  
  if (!user.is_approved) {
    throw new Error('Please verify your email address before logging in');
  }
  
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const sendConfirmationEmail = async (email) => {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const confirmationLink = `${window.location.origin}/confirm-email?token=${token}&email=${encodeURIComponent(email)}`;
  
  await fetch('http://localhost:3001/confirmations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }),
  });
  
  return confirmationLink;
};

export const confirmEmail = async (token, email) => {
  const response = await fetch(`http://localhost:3001/confirmations?token=${token}&email=${encodeURIComponent(email)}`);
  const confirmations = await response.json();
  
  if (confirmations.length === 0) {
    throw new Error('Invalid or expired confirmation link');
  }
  
  const confirmation = confirmations[0];
  
  if (new Date(confirmation.expires_at) < new Date()) {
    throw new Error('Confirmation link has expired');
  }
  
  const userResponse = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(email)}`);
  const users = await userResponse.json();
  
  if (users.length === 0) {
    throw new Error('User not found');
  }
  
  const user = users[0];
  
  await fetch(`http://localhost:3001/users/${user.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      is_approved: true
    }),
  });
  
  await fetch(`http://localhost:3001/confirmations/${confirmation.id}`, {
    method: 'DELETE'
  });
  
  return true;
};