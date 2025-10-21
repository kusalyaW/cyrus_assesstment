# JWT Authentication Implementation

This application now uses JWT (JSON Web Token) authentication instead of session-based authentication.

## What Changed

### Backend Changes

1. **Installed `jsonwebtoken` package** - Used for creating and verifying JWT tokens

2. **Updated `config.js`** - Added JWT configuration:
   - `jwtSecret` - Secret key for signing tokens
   - `jwtExpiresIn` - Token expiration time (default: 7 days)

3. **Updated `auth.controller.js`**:
   - `login()` - Now generates and returns a JWT token along with user data
   - `logout()` - Simplified (token removal is handled client-side)
   - `me()` - Now reads user data from `req.user` instead of `req.session`

4. **Updated `middleware/auth.js`**:
   - `requireAuth()` - Now verifies JWT tokens from Authorization header
   - `requireRole()` - Updated to use `req.user` instead of `req.session.user`

5. **Updated `app.js`**:
   - Removed session middleware and MySQL session store
   - Removed cookie-parser (no longer needed)

6. **Updated all controllers**:
   - Changed from `req.session.user` to `req.user` throughout the codebase

### Frontend Changes

1. **Updated `api/client.js`**:
   - Added `getToken()` and `setToken()` helper functions
   - Modified `api()` function to include JWT token in Authorization header
   - Token is stored in localStorage

2. **Updated `context/AuthContext.jsx`**:
   - `login()` - Now stores JWT token in localStorage
   - `logout()` - Removes token from localStorage
   - `useEffect()` - Checks for existing token on app load

## Environment Variables

Add the following to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Important**: Change the `JWT_SECRET` to a strong, random string in production!

## How It Works

### Authentication Flow

1. **Login**:
   - User submits email and password
   - Server validates credentials
   - Server generates JWT token with user data (id, name, email, role)
   - Server returns token and user data
   - Client stores token in localStorage

2. **Authenticated Requests**:
   - Client includes token in Authorization header: `Bearer <token>`
   - Server middleware verifies token
   - If valid, user data is attached to `req.user`
   - Controller functions use `req.user` to access authenticated user info

3. **Logout**:
   - Client removes token from localStorage
   - Server endpoint is called for consistency (but doesn't do much server-side)

### Token Format

The JWT token contains:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Security Considerations

1. **Always use HTTPS in production** - JWT tokens should never be transmitted over unencrypted connections
2. **Use a strong JWT_SECRET** - At least 32 random characters
3. **Set appropriate token expiration** - Balance between security and user experience
4. **Token storage** - localStorage is used for simplicity, but consider httpOnly cookies for enhanced security
5. **Token refresh** - Consider implementing token refresh mechanism for long-lived sessions

## Testing the Implementation

### Login Request
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Response:
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Authenticated Request
```bash
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Migration Notes

- Sessions table in MySQL is no longer needed (can be dropped)
- Old sessions are invalid - users need to log in again
- No need for express-session or express-mysql-session packages anymore
- Token expiration replaces session timeout
